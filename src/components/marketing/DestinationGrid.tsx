import Link from 'next/link'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import { countries } from '@/lib/countries'

export default function DestinationGrid() {
  const list = Object.values(countries)

  return (
    <Section id="destinos">
      <Container>
        <div className="mb-8">
          <span className="eyebrow">Destinos</span>
          <h2 className="mt-4 text-3xl font-black md:text-4xl">
            Elige el país o región que quieres evaluar
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Cada evaluación es distinta. No tiene sentido preguntarle lo mismo a
            alguien que quiere Canadá y a alguien que quiere EE. UU.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {list.map((country) => (
            <Card key={country.slug} className="flex h-full flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold">{country.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {country.shortBlurb}
                </p>
                <ul className="mt-5 space-y-2 text-sm text-slate-500">
                  {country.routes.slice(0, 3).map((route) => (
                    <li key={route}>• {route}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <Link
                  href={`/evaluacion/${country.slug}`}
                  className="btn-primary w-full"
                >
                  Evaluar {country.name}
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}