import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState, type FormEvent } from 'react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ProgressBar from '@/components/ui/ProgressBar'
import { getCountry } from '@/lib/countries'
import { getBand, getBandLabel, getRecommendation } from '@/lib/scoring'

type Answers = Record<string, number>

type EvaluationApiResult = {
  ok: boolean
  evaluation?: {
    id?: string
    country: string
    score: number
    band: string
  }
  recommendation?: string
  error?: string
}

const WHATSAPP_NUMBER = '18090000000'

export default function EvaluationPage() {
  const router = useRouter()
  const country = useMemo(() => getCountry(router.query.slug), [router.query.slug])

  const [started, setStarted] = useState(false)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})

  const [lead, setLead] = useState({
    firstName: '',
    lastName: '',
    email: '',
    whatsapp: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [apiResult, setApiResult] = useState<EvaluationApiResult | null>(null)

  const total = country.questions.length
  const currentQuestion = step < total ? country.questions[step] : null
  const finished = started && step >= total

  const localScore = useMemo(() => {
    const totalPoints = Object.values(answers).reduce((acc, value) => acc + value, 0)
    return total > 0 ? Math.round((totalPoints / (total * 10)) * 100) : 0
  }, [answers, total])

  const finalScore = apiResult?.evaluation?.score ?? localScore
  const band = useMemo(() => getBand(finalScore), [finalScore])
  const bandLabel = useMemo(() => getBandLabel(finalScore), [finalScore])
  const recommendation = useMemo(() => {
    return apiResult?.recommendation ?? getRecommendation(finalScore)
  }, [apiResult?.recommendation, finalScore])

  const bandClass = useMemo(() => {
    switch (band) {
      case 'strong':
        return 'score-strong'
      case 'medium':
        return 'score-medium'
      default:
        return 'score-weak'
    }
  }, [band])

  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined
  const canContinue = currentAnswer !== undefined

  const whatsappHref = useMemo(() => {
    const text = `Hola, completé la evaluación de ${country.name} y mi resultado fue ${finalScore}/100`
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
  }, [country.name, finalScore])

  const handleStart = useCallback(() => {
    setStarted(true)
    setStep(0)
    setSubmitError('')
    setApiResult(null)
  }, [])

  const handleRestart = useCallback(() => {
    setStarted(false)
    setStep(0)
    setAnswers({})
    setLead({
      firstName: '',
      lastName: '',
      email: '',
      whatsapp: '',
    })
    setSubmitting(false)
    setSubmitError('')
    setApiResult(null)
  }, [])

  const handleSelect = useCallback((questionId: string, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }, [])

  const handleBack = useCallback(() => {
    setStep((prev) => Math.max(0, prev - 1))
  }, [])

  const handleNext = useCallback(() => {
    if (!canContinue) return
    setStep((prev) => prev + 1)
  }, [canContinue])

  const handleLeadChange = useCallback(
    (field: 'firstName' | 'lastName' | 'email' | 'whatsapp', value: string) => {
      setLead((prev) => ({
        ...prev,
        [field]: value,
      }))
    },
    []
  )

  const handleLeadSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setSubmitError('')

      if (!lead.firstName.trim()) {
        setSubmitError('Escribe tu nombre.')
        return
      }

      if (!lead.lastName.trim()) {
        setSubmitError('Escribe tu apellido.')
        return
      }

      if (!lead.email.trim()) {
        setSubmitError('Escribe tu correo.')
        return
      }

      if (!lead.whatsapp.trim()) {
        setSubmitError('Escribe tu WhatsApp.')
        return
      }

      try {
        setSubmitting(true)

        const response = await fetch('/api/evaluations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            country: country.slug,
            answers,
            contactName: `${lead.firstName} ${lead.lastName}`.trim(),
            contactEmail: lead.email.trim(),
            contactPhone: lead.whatsapp.trim(),
            whatsapp: lead.whatsapp.trim(),
            landingPath: typeof router.asPath === 'string' ? router.asPath : `/evaluacion/${country.slug}`,
          }),
        })

        const data: EvaluationApiResult = await response.json()

        if (!response.ok || !data?.ok || !data?.evaluation) {
          throw new Error(data?.error || 'No se pudo generar la puntuación')
        }

        setApiResult(data)
      } catch (error: any) {
        setSubmitError(error?.message || 'Error inesperado al generar la puntuación')
      } finally {
        setSubmitting(false)
      }
    },
    [answers, country.slug, lead, router.asPath]
  )

  return (
    <>
      <Head>
        <title>{country.name} | Evaluación inicial</title>
        <meta
          name="description"
          content={`Responde 10 preguntas y evalúa la fortaleza de tu caso migratorio para ${country.name}.`}
        />
      </Head>

      <main className="page-shell">
        <Section className="pt-10 md:pt-16">
          <Container className="max-w-3xl">
            {!started && (
              <Card className="animate-fade-in-up">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 shadow-sm">
                    <img
                      src={country.icon}
                      alt={country.name}
                      className="h-10 w-10 object-contain"
                    />
                  </div>

                  <span className="eyebrow">{country.name}</span>
                </div>

                <h1 className="mt-4 text-4xl font-black leading-tight">
                  {country.heroTitle}
                </h1>

                <p className="mt-4 text-slate-600">
                  {country.heroSubtitle}
                </p>

                <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                  <div className="text-sm font-semibold text-slate-500">
                    Antes de empezar
                  </div>

                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    <li>• Son {total} preguntas</li>
                    <li>• Te toma 2 a 3 minutos</li>
                    <li>• Al final te pediremos tus datos para mostrar tu puntuación</li>
                  </ul>
                </div>

                <div className="mt-8">
                  <Button onClick={handleStart}>
                    Empezar evaluación
                  </Button>
                </div>
              </Card>
            )}

            {started && !finished && currentQuestion && (
              <Card className="animate-fade-in-up">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 shadow-sm">
                    <img
                      src={country.icon}
                      alt={country.name}
                      className="h-9 w-9 object-contain"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <ProgressBar current={step + 1} total={total} />
                  </div>
                </div>

                <h2 className="mt-6 text-2xl font-black md:text-3xl">
                  {currentQuestion.title}
                </h2>

                <div
                  className="mt-6 space-y-3"
                  role="radiogroup"
                  aria-label={currentQuestion.title}
                >
                  {currentQuestion.options.map((option) => {
                    const active = currentAnswer === option.value

                    return (
                      <button
                        key={`${currentQuestion.id}-${option.label}`}
                        type="button"
                        onClick={() => handleSelect(currentQuestion.id, option.value)}
                        aria-pressed={active}
                        className={`w-full rounded-2xl border p-4 text-left transition ${
                          active
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <span className="font-medium text-slate-800">
                          {option.label}
                        </span>
                      </button>
                    )
                  })}
                </div>

                <div className="mt-8 flex items-center justify-between gap-3">
                  <Button
                    variant="secondary"
                    onClick={handleBack}
                    disabled={step === 0}
                    className={step === 0 ? 'opacity-50' : ''}
                  >
                    Atrás
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={!canContinue}
                    className={!canContinue ? 'opacity-50' : ''}
                  >
                    {step === total - 1 ? 'Continuar' : 'Continuar'}
                  </Button>
                </div>
              </Card>
            )}

            {finished && !apiResult && (
              <Card className="animate-fade-in-up">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 shadow-sm">
                    <img
                      src={country.icon}
                      alt={country.name}
                      className="h-10 w-10 object-contain"
                    />
                  </div>

                  <span className="eyebrow">Último paso</span>
                </div>

                <h1 className="mt-4 text-3xl font-black md:text-4xl">
                  Completa tus datos para generar tu puntuación
                </h1>

                <p className="mt-4 text-slate-600">
                  Te mostraremos el resultado al instante y podremos enviarte seguimiento por WhatsApp.
                </p>

                <form onSubmit={handleLeadSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={lead.firstName}
                      onChange={(e) => handleLeadChange('firstName', e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Apellido
                    </label>
                    <input
                      type="text"
                      value={lead.lastName}
                      onChange={(e) => handleLeadChange('lastName', e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
                      placeholder="Tu apellido"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      value={lead.email}
                      onChange={(e) => handleLeadChange('email', e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
                      placeholder="tucorreo@email.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={lead.whatsapp}
                      onChange={(e) => handleLeadChange('whatsapp', e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
                      placeholder="+1 809 000 0000"
                    />
                  </div>

                  {submitError && (
                    <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {submitError}
                    </div>
                  )}

                  <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" disabled={submitting} className={submitting ? 'opacity-50' : ''}>
                      {submitting ? 'Generando puntuación...' : 'Ver mi puntuación'}
                    </Button>

                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleRestart}
                    >
                      Empezar de nuevo
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {finished && apiResult && (
              <Card className="animate-fade-in-up">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 shadow-sm">
                    <img
                      src={country.icon}
                      alt={country.name}
                      className="h-10 w-10 object-contain"
                    />
                  </div>

                  <span className="eyebrow">Resultado inicial</span>
                </div>

                <h1 className="mt-4 text-3xl font-black md:text-4xl">
                  Tu puntuación: {finalScore}/100
                </h1>

                <p className={`mt-3 text-lg font-semibold ${bandClass}`}>
                  {bandLabel}
                </p>

                <p className="mt-5 leading-7 text-slate-600">
                  {recommendation}
                </p>

                <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                  <div className="text-sm font-semibold text-slate-500">
                    Siguiente paso recomendado
                  </div>
                  <p className="mt-2 text-slate-700">
                    Lleva este resultado a WhatsApp o agenda una revisión más profunda.
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={whatsappHref}
                    className="btn-primary"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ir a WhatsApp
                  </a>

                  <Button
  href={`/agendar?destino=${country.slug}&score=${finalScore}&evaluationId=${apiResult?.evaluation?.id ?? ''}`}
  variant="secondary"
>
  Agendar revisión
</Button>

                  <Button
                    onClick={handleRestart}
                    variant="secondary"
                  >
                    Repetir evaluación
                  </Button>
                </div>
              </Card>
            )}
          </Container>
        </Section>
      </main>
    </>
  )
}