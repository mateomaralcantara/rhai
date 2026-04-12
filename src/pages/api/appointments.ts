import type { NextApiRequest, NextApiResponse } from 'next'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

type DestinationSlug = 'usa' | 'canada' | 'europa' | 'otros'

type AppointmentBody = {
  name?: string
  email?: string
  phone?: string
  whatsapp?: string
  message?: string
  destination?: DestinationSlug
  evaluationId?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  landingPath?: string
}

type ApiResponse =
  | {
      ok: true
      appointment: {
        id: string
        destination: DestinationSlug
        status: string
        created_at: string
        prospect_id?: string | null
        evaluation_id?: string | null
      }
    }
  | {
      ok: false
      error: string
      details?: string
    }

const VALID_DESTINATIONS = new Set<DestinationSlug>(['usa', 'canada', 'europa', 'otros'])

function normalizeText(value?: string | null) {
  const clean = value?.trim()
  return clean ? clean : null
}

function normalizeEmail(value?: string) {
  const clean = value?.trim().toLowerCase()
  return clean ? clean : null
}

function getIp(req: NextApiRequest) {
  const forwarded = req.headers['x-forwarded-for']

  if (Array.isArray(forwarded)) {
    return forwarded[0] ?? null
  }

  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0]?.trim() ?? null
  }

  return req.socket?.remoteAddress ?? null
}

function isValidDestination(value: unknown): value is DestinationSlug {
  return typeof value === 'string' && VALID_DESTINATIONS.has(value as DestinationSlug)
}

async function findExistingProspect(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  email: string | null,
  whatsapp: string | null
) {
  if (email) {
    const { data, error } = await supabaseAdmin
      .from('prospects')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (error) throw error
    if (data?.id) return data.id as string
  }

  if (whatsapp) {
    const { data, error } = await supabaseAdmin
      .from('prospects')
      .select('id')
      .eq('whatsapp', whatsapp)
      .maybeSingle()

    if (error) throw error
    if (data?.id) return data.id as string
  }

  return null
}

async function upsertProspectFromAppointment(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  body: AppointmentBody
) {
  const email = normalizeEmail(body.email)
  const whatsapp = normalizeText(body.whatsapp)
  const phone = normalizeText(body.phone)
  const fullName = normalizeText(body.name)
  const destination = body.destination

  const existingId = await findExistingProspect(supabaseAdmin, email, whatsapp)

  const basePayload = {
    full_name: fullName ?? 'Sin nombre',
    email,
    whatsapp,
    phone,
    country_interest: destination,
    source: 'appointment',
    latest_landing_path: normalizeText(body.landingPath),
    utm_source: normalizeText(body.utmSource),
    utm_medium: normalizeText(body.utmMedium),
    utm_campaign: normalizeText(body.utmCampaign),
    last_seen_at: new Date().toISOString(),
    status: 'scheduled',
  }

  if (existingId) {
    const { data, error } = await supabaseAdmin
      .from('prospects')
      .update(basePayload)
      .eq('id', existingId)
      .select('id')
      .single()

    if (error) throw error
    return data.id as string
  }

  const { data, error } = await supabaseAdmin
    .from('prospects')
    .insert({
      ...basePayload,
      first_seen_at: new Date().toISOString(),
      first_landing_path: normalizeText(body.landingPath),
    })
    .select('id')
    .single()

  if (error) throw error
  return data.id as string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      error: 'Método no permitido',
    })
  }

  try {
    const body = req.body as AppointmentBody

    if (!normalizeText(body.name)) {
      return res.status(400).json({
        ok: false,
        error: 'Falta name',
      })
    }

    if (!normalizeEmail(body.email)) {
      return res.status(400).json({
        ok: false,
        error: 'Falta email',
      })
    }

    if (!isValidDestination(body.destination)) {
      return res.status(400).json({
        ok: false,
        error: 'Destination inválido o faltante',
      })
    }

    const supabaseAdmin = getSupabaseAdmin()

    const prospectId = await upsertProspectFromAppointment(supabaseAdmin, body)

    const appointmentPayload = {
      prospect_id: prospectId,
      evaluation_id: normalizeText(body.evaluationId),
      name: normalizeText(body.name),
      email: normalizeEmail(body.email),
      phone: normalizeText(body.phone),
      whatsapp: normalizeText(body.whatsapp),
      message: normalizeText(body.message),
      destination: body.destination,
      status: 'new',
      ip: getIp(req),
      user_agent: req.headers['user-agent'] ?? null,
    }

    const { data, error } = await supabaseAdmin
      .from('appointments')
      .insert(appointmentPayload)
      .select('id, destination, status, created_at, prospect_id, evaluation_id')
      .single()

    if (error) {
      console.error('Supabase insert error [appointments]:', error)

      return res.status(500).json({
        ok: false,
        error: 'No se pudo guardar la cita',
        details: error.message,
      })
    }

    return res.status(201).json({
      ok: true,
      appointment: data,
    })
  } catch (error: any) {
    console.error('API /appointments error:', error)

    return res.status(500).json({
      ok: false,
      error: 'Error interno del servidor',
      details: error?.message ?? 'Unknown error',
    })
  }
}