import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'

export default function Hero() {
  return (
    <Section className="pt-10 md:pt-16">
      <Container>
        <div className="soft-panel overflow-hidden p-8 md:p-12 animate-fade-in-up">
          <div className="grid gap-10 md:grid-cols-[1.2fr_.8fr] md:items-center">
            <div>
              <span className="eyebrow">Evaluación inicial inteligente</span>
              <h1 className="hero-title mt-5 max-w-3xl">
                Evalúa la fortaleza de tu caso migratorio antes de aplicar
              </h1>
              <p className="hero-copy">
                Elige tu destino, responde 10 preguntas y recibe una lectura inicial clara
                para tomar el siguiente paso con estrategia.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="#destinos">Comenzar evaluación</Button>
                <Button href="#como-funciona" variant="secondary">
                  Ver cómo funciona
                </Button>
              </div>
            </div>

            <div className="card-ui">
              <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Lo que recibe el usuario
              </div>
              <ul className="space-y-4 text-slate-700">
                <li>• Puntuación inicial del perfil</li>
                <li>• Lectura simple: fuerte, medio o débil</li>
                <li>• Recomendación según su país</li>
                <li>• Siguiente paso sugerido</li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}