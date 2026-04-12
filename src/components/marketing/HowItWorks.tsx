import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'

const steps = [
  {
    title: '1. Eliges destino',
    text: 'Cada país tiene lógica distinta, así que el usuario entra por la ruta correcta.',
  },
  {
    title: '2. Respondes 10 preguntas',
    text: 'El flujo es rápido, guiado y pensado para móvil.',
  },
  {
    title: '3. Recibes puntuación y siguiente paso',
    text: 'El resultado no promete magia: orienta con claridad.',
  },
]

export default function HowItWorks() {
  return (
    <Section id="como-funciona">
      <Container>
        <div className="mb-8">
          <span className="eyebrow">Cómo funciona</span>
          <h2 className="mt-4 text-3xl font-black md:text-4xl">
            Un proceso simple, serio y útil
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.title}>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="mt-3 text-slate-600">{step.text}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}