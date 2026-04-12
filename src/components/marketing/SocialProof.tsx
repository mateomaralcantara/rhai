import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'

const testimonials = [
  {
    name: 'Cliente 1',
    text: 'La evaluación me aterrizó. Yo iba a aplicar mal y terminé ordenando todo primero.',
  },
  {
    name: 'Cliente 2',
    text: 'Me gustó que me dijeron la verdad, no promesas raras.',
  },
  {
    name: 'Cliente 3',
    text: 'Entré por curiosidad y salí entendiendo cuál era mi mejor ruta.',
  },
]

export default function SocialProof() {
  return (
    <Section>
      <Container>
        <div className="mb-8">
          <span className="eyebrow">Confianza</span>
          <h2 className="mt-4 text-3xl font-black md:text-4xl">
            La claridad también vende
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.name}>
              <p className="text-slate-700">“{item.text}”</p>
              <div className="mt-5 text-sm font-semibold text-slate-500">
                {item.name}
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}