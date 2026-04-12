import Head from 'next/head'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState, type FormEvent } from 'react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

type DestinationSlug = 'usa' | 'canada' | 'europa' | 'otros'

type AppointmentResponse = {
  ok: boolean
  appointment?: {
    id: string
    destination: DestinationSlug
    status: string
    created_at: string
    prospect_id?: string | null
    evaluation_id?: string | null
  }
  error?: string
  details?: string
}

const DESTINATION_LABELS: Record<DestinationSlug, string> = {
  usa: 'Estados Unidos',
  canada: 'Canadá',
  europa: 'Europa',
  otros: 'Otros países',
}

function getDestination(value: unknown): DestinationSlug {
  if (typeof value === 'string' && value in DESTINATION_LABELS) {
    return value as DestinationSlug
  }
  return 'usa'
}

export default function AgendarPage() {
  const router = useRouter()

  const destination = useMemo(
    () => getDestination(router.query.destino),
    [router.query.destino]
  )

  const score = useMemo(() => {
    const raw = router.query.score
    if (typeof raw !== 'string') return null
    const numeric = Number(raw)
    return Number.isFinite(numeric) ? numeric : null
  }, [router.query.score])

  const evaluationId = useMemo(() => {
    return typeof router.query.evaluationId === 'string'
      ? router.query.evaluationId
      : null
  }, [router.query.evaluationId])

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    message: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [success, setSuccess] = useState<AppointmentResponse['appointment'] | null>(null)

  const destinationLabel = DESTINATION_LABELS[destination]

  const handleChange = useCallback(
    (field: 'name' | 'email' | 'phone' | 'whatsapp' | 'message', value: string) => {
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }))
    },
    []
  )

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setSubmitError('')
      setSuccess(null)

      if (!form.name.trim()) {
        setSubmitError('Escribe tu nombre.')
        return
      }

      if (!form.email.trim()) {
        setSubmitError('Escribe tu correo.')
        return
      }

      if (!form.whatsapp.trim()) {
        setSubmitError('Escribe tu WhatsApp.')
        return
      }

      try {
        setSubmitting(true)

        const response = await fetch('/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            whatsapp: form.whatsapp.trim(),
            message: form.message.trim(),
            destination,
            evaluationId,
            landingPath:
              typeof router.asPath === 'string'
                ? router.asPath
                : `/agendar?destino=${destination}`,
          }),
        })

        const data: AppointmentResponse = await response.json()

        if (!response.ok || !data.ok || !data.appointment) {
          throw new Error(data.error || data.details || 'No se pudo guardar la cita')
        }

        setSuccess(data.appointment)

        setForm({
          name: '',
          email: '',
          phone: '',
          whatsapp: '',
          message: '',
        })
      } catch (error: any) {
        setSubmitError(error?.message || 'Error inesperado al guardar la cita')
      } finally {
        setSubmitting(false)
      }
    },
    [destination, evaluationId, form, router.asPath]
  )

  return (
    <>
      <Head>
        <title>Agendar revisión | {destinationLabel}</title>
        <meta
          name="description"
          content={`Agenda una revisión para tu caso migratorio hacia ${destinationLabel}.`}
        />
      </Head>

      <main className="page-shell">
        <Section className="pt-10 md:pt-16">
          <Container className="max-w-3xl">
            <Card className="animate-fade-in-up">
              <span className="eyebrow">Agendar revisión</span>

              <h1 className="mt-4 text-3xl font-black md:text-4xl">
                Agenda una revisión para {destinationLabel}
              </h1>

              <p className="mt-4 text-slate-600">
                Déjanos tus datos y te contactaremos para revisar tu caso con más detalle.
              </p>

              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <div className="text-sm font-semibold text-slate-500">
                  Resumen
                </div>

                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <p>
                    <strong>Destino:</strong> {destinationLabel}
                  </p>

                  {score !== null && (
                    <p>
                      <strong>Puntuación:</strong> {score}/100
                    </p>
                  )}

                  {evaluationId && (
                    <p className="break-all">
                      <strong>Evaluación vinculada:</strong> {evaluationId}
                    </p>
                  )}
                </div>
              </div>

              {!success && (
                <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
                      placeholder="tucorreo@email.com"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
                      placeholder="809 000 0000"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={form.whatsapp}
                      onChange={(e) => handleChange('whatsapp', e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
                      placeholder="+1 809 000 0000"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Mensaje
                    </label>
                    <textarea
                      value={form.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      className="min-h-[120px] w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"
                      placeholder="Cuéntanos brevemente tu caso o qué deseas revisar"
                    />
                  </div>

                  {submitError && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {submitError}
                    </div>
                  )}

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className={submitting ? 'opacity-50' : ''}
                    >
                      {submitting ? 'Guardando cita...' : 'Confirmar solicitud'}
                    </Button>

                    <Button
                      href={`/evaluacion/${destination}`}
                      variant="secondary"
                    >
                      Volver a evaluación
                    </Button>
                  </div>
                </form>
              )}

              {success && (
                <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5">
                  <h2 className="text-xl font-bold text-green-900">
                    Solicitud enviada
                  </h2>

                  <p className="mt-2 text-green-800">
                    Tu cita quedó registrada correctamente. Te contactaremos pronto.
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-green-900">
                    <p>
                      <strong>ID de cita:</strong> {success.id}
                    </p>
                    <p>
                      <strong>Estado:</strong> {success.status}
                    </p>
                    {success.prospect_id && (
                      <p className="break-all">
                        <strong>Prospecto vinculado:</strong> {success.prospect_id}
                      </p>
                    )}
                    {success.evaluation_id && (
                      <p className="break-all">
                        <strong>Evaluación vinculada:</strong> {success.evaluation_id}
                      </p>
                    )}
                  </div>

                  <div className="mt-6">
                    <Button href={`/evaluacion/${destination}`} variant="secondary">
                      Hacer otra evaluación
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </Container>
        </Section>
      </main>
    </>
  )
}