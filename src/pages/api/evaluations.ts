import type { NextApiRequest, NextApiResponse } from 'next'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { getBand, getRecommendation } from '@/lib/scoring'

type CountrySlug = 'usa' | 'canada' | 'europa' | 'otros'
type Answers = Record<string, number>

type EvaluationBody = {
  country?: CountrySlug
  answers?: Answers
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  whatsapp?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  landingPath?: string
}

const EXPECTED_ANSWER_COUNT = 10
const VALID_COUNTRIES = new Set<CountrySlug>(['usa', 'canada', 'europa', 'otros'])

function computeScore(answers: Answers) {
  const values = Object.values(answers)
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value))

  if (!values.length) return 0

  const total = values.reduce((acc, value) => acc + value, 0)
  return Math.round((total / (values.length * 10)) * 100)
}

function getIp(req: NextApiRequest) {
  const forwarded = req.headers['x-forwarded-for']

  if (Array.isArray(forwarded)) return forwarded[0] ?? null
  if (typeof forwarded === 'string') return forwarded.split(',')[0]?.trim() ?? null

  return req.socket?.remoteAddress ?? null
}

function normalizeText(value?: string | null) {
  const clean = value?.trim()
  return clean ? clean : null
}

function normalizeEmail(value?: string) {
  const clean = value?.trim().toLowerCase()
  return clean ? clean : null
}

function isValidCountry(value: unknown): value is CountrySlug {
  return typeof value === 'string' && VALID_COUNTRIES.has(value as CountrySlug)
}

function isValidAnswers(value: unknown): value is Answers {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false

  const entries = Object.entries(value)
  if (entries.length !== EXPECTED_ANSWER_COUNT) return false

  return entries.every(([key, raw]) => {
    const numeric = Number(raw)
    return Boolean(key) && Number.isFinite(numeric) && numeric >= 0 && numeric <= 10
  })
}

async function findExistingProspect(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  email: string | null,
  whatsapp: string | null
) {
  if (email) {
    const { data } = await supabaseAdmin
      .from('prospects')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (data?.id) return data.id as string
  }

  if (whatsapp) {
    const { data } = await supabaseAdmin
      .from('prospects')
      .select('id')
      .eq('whatsapp', whatsapp)
      .maybeSingle()

    if (data?.id) return data.id as string
  }

  return null
}

async function upsertProspect(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  body: EvaluationBody,
  score: number,
  band: string,
  recommendation: string
) {
  const email = normalizeEmail(body.contactEmail)
  const whatsapp = normalizeText(body.whatsapp)
  const phone = normalizeText(body.contactPhone)
  const fullName = normalizeText(body.contactName)

  const existingId = await findExistingProspect(supabaseAdmin, email, whatsapp)

  const prospectPayload = {
    full_name: fullName ?? 'Sin nombre',
    email,
    whatsapp,
    phone,
    country_interest: body.country,
    latest_score: score,
    latest_band: band,
    latest_recommendation: recommendation,
    source: 'evaluation',
    latest_landing_path: normalizeText(body.landingPath),
    utm_source: normalizeText(body.utmSource),
    utm_medium: normalizeText(body.utmMedium),
    utm_campaign: normalizeText(body.utmCampaign),
    last_seen_at: new Date().toISOString(),
  }

  if (existingId) {
    const { data, error } = await supabaseAdmin
      .from('prospects')
      .update(prospectPayload)
      .eq('id', existingId)
      .select('id')
      .single()

    if (error) throw error
    return data.id as string
  }

  const { data, error } = await supabaseAdmin
    .from('prospects')
    .insert({
      ...prospectPayload,
      first_seen_at: new Date().toISOString(),
      first_landing_path: normalizeText(body.landingPath),
      status: 'new',
    })
    .select('id')
    .single()

  if (error) throw error
  return data.id as string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Método no permitido' })
  }

  try {
    const body = req.body as EvaluationBody

    if (!isValidCountry(body?.country)) {
      return res.status(400).json({ ok: false, error: 'Country inválido o faltante' })
    }

    if (!isValidAnswers(body?.answers)) {
      const count =
        body?.answers && typeof body.answers === 'object'
          ? Object.keys(body.answers).length
          : 0

      return res.status(400).json({
        ok: false,
        error: `Se esperaban ${EXPECTED_ANSWER_COUNT} respuestas válidas y llegaron ${count}`,
      })
    }

    const supabaseAdmin = getSupabaseAdmin()
    const score = computeScore(body.answers)
    const band = getBand(score)
    const recommendation = getRecommendation(score)

    const prospectId = await upsertProspect(
      supabaseAdmin,
      body,
      score,
      band,
      recommendation
    )

    const evaluationPayload = {
      prospect_id: prospectId,
      country: body.country,
      score,
      band,
      recommendation,
      answers: body.answers,
      contact_name: normalizeText(body.contactName),
      contact_email: normalizeEmail(body.contactEmail),
      contact_phone: normalizeText(body.contactPhone),
      whatsapp: normalizeText(body.whatsapp),
      utm_source: normalizeText(body.utmSource),
      utm_medium: normalizeText(body.utmMedium),
      utm_campaign: normalizeText(body.utmCampaign),
      landing_path: normalizeText(body.landingPath),
      ip: getIp(req),
      user_agent: req.headers['user-agent'] ?? null,
    }

    const { data, error } = await supabaseAdmin
      .from('evaluations')
      .insert(evaluationPayload)
      .select('id, country, score, band, created_at, prospect_id')
      .single()

    if (error) {
      console.error('Supabase insert error [evaluations]:', error)
      return res.status(500).json({
        ok: false,
        error: 'No se pudo guardar la evaluación',
        details: error.message,
      })
    }

    return res.status(201).json({
      ok: true,
      evaluation: data,
      recommendation,
    })
  } catch (error: any) {
    console.error('API /evaluations error:', error)

    return res.status(500).json({
      ok: false,
      error: 'Error interno del servidor',
      details: error?.message ?? 'Unknown error',
    })
  }
}