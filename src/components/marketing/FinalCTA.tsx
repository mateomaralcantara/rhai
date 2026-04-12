import Button from '@/components/ui/Button'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'

export default function FinalCTA() {
  return (
    <Section>
      <Container>
        <div className="soft-panel p-8 text-center md:p-12">
          <h2 className="text-3xl font-black md:text-4xl">
            Tu caso no se improvisa: se evalúa
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Empieza por el diagnóstico correcto. Luego decides el camino.
          </p>
          <div className="mt-8">
            <Button href="#destinos">Iniciar evaluación</Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}