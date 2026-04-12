export type CountrySlug = 'usa' | 'canada' | 'europa' | 'otros'

export type AnswerOption = {
  label: string
  value: number
}

export type Question = {
  id: string
  title: string
  options: AnswerOption[]
}

export type CountryConfig = {
  slug: CountrySlug
  name: string
  shortBlurb: string
  heroTitle: string
  heroSubtitle: string
  routes: string[]
  icon: string
  questions: Question[]
}

export const DEFAULT_COUNTRY: CountrySlug = 'usa'

const scale = {
  strong: 10,
  good: 8,
  mid: 6,
  weak: 3,
  none: 0,
} as const

const makeOption = (label: string, value: number): AnswerOption => ({
  label,
  value,
})

const makeQuestion = (
  id: string,
  title: string,
  options: AnswerOption[]
): Question => ({
  id,
  title,
  options,
})

export const countries: Record<CountrySlug, CountryConfig> = {
  usa: {
    slug: 'usa',
    name: 'Estados Unidos',
    shortBlurb: 'Evalúa si tu perfil tiene base para una ruta a EE. UU.',
    heroTitle: 'Evalúa tu fortaleza migratoria para Estados Unidos',
    heroSubtitle:
      'Responde 10 preguntas y descubre si tu perfil está fuerte, medio o débil por ahora.',
    routes: [
      'Turismo / Negocios',
      'Estudio',
      'Trabajo',
      'Petición familiar',
      'Residencia',
    ],
    icon: '/icons/eeuu.ico',
    questions: [
      makeQuestion('usa_1', '¿Cuál es tu objetivo principal en EE. UU.?', [
        makeOption('Turismo o visita clara', scale.strong),
        makeOption('Estudio o trabajo definido', scale.good),
        makeOption('Todavía no lo tengo claro', scale.weak),
      ]),
      makeQuestion('usa_2', '¿Has tenido visa estadounidense antes?', [
        makeOption('Sí, y la usé correctamente', scale.strong),
        makeOption('Sí, pero hace mucho o con uso limitado', scale.good),
        makeOption('No', scale.mid),
      ]),
      makeQuestion('usa_3', '¿Te han rechazado una visa antes?', [
        makeOption('No', scale.strong),
        makeOption('Sí, una vez', scale.mid),
        makeOption('Sí, varias veces', scale.weak),
      ]),
      makeQuestion('usa_4', '¿Tienes empleo, negocio o ingresos demostrables?', [
        makeOption('Sí, bien documentados', scale.strong),
        makeOption('Sí, pero parcialmente documentados', scale.good),
        makeOption('No o casi nada', scale.weak),
      ]),
      makeQuestion('usa_5', '¿Tienes historial de viajes internacionales?', [
        makeOption('Sí, frecuente y ordenado', scale.strong),
        makeOption('Sí, algunos viajes', scale.good),
        makeOption('No', scale.mid),
      ]),
      makeQuestion('usa_6', '¿Qué tan fuerte está tu respaldo financiero?', [
        makeOption('Tengo fondos / movimientos consistentes', scale.strong),
        makeOption('Tengo algo, pero debo ordenarlo mejor', scale.good),
        makeOption('Muy débil o inexistente', scale.weak),
      ]),
      makeQuestion('usa_7', '¿Tienes familiares directos en EE. UU.?', [
        makeOption('No', scale.strong),
        makeOption('Sí, pero no dependo de ellos', scale.good),
        makeOption('Sí, y todo mi plan depende de eso', scale.mid),
      ]),
      makeQuestion(
        'usa_8',
        '¿Has tenido problemas migratorios o estadías vencidas en otros países?',
        [
          makeOption('No', scale.strong),
          makeOption('No estoy seguro / hubo algo menor', scale.mid),
          makeOption('Sí', scale.weak),
        ]
      ),
      makeQuestion(
        'usa_9',
        '¿Tienes tus documentos personales y financieros organizados?',
        [
          makeOption('Sí, casi todo listo', scale.strong),
          makeOption('Más o menos', scale.good),
          makeOption('No', scale.weak),
        ]
      ),
      makeQuestion('usa_10', '¿Qué tan claro tienes cómo presentar tu caso?', [
        makeOption('Muy claro', scale.strong),
        makeOption('Tengo idea, pero necesito guía', scale.good),
        makeOption('Estoy perdido', scale.weak),
      ]),
    ],
  },

  canada: {
    slug: 'canada',
    name: 'Canadá',
    shortBlurb: 'Mide si tu perfil tiene base para estudio, trabajo o residencia.',
    heroTitle: 'Evalúa tu fortaleza migratoria para Canadá',
    heroSubtitle:
      'Responde 10 preguntas y recibe una lectura inicial de tu perfil.',
    routes: ['Estudio', 'Trabajo', 'Express Entry', 'PNP', 'Residencia'],
    icon: '/icons/canada.ico',
    questions: [
      makeQuestion('canada_1', '¿Qué ruta te interesa más en Canadá?', [
        makeOption('Tengo una ruta clara', scale.strong),
        makeOption('Estoy entre dos opciones', scale.good),
        makeOption('No lo sé todavía', scale.weak),
      ]),
      makeQuestion('canada_2', '¿Cuál es tu nivel educativo?', [
        makeOption('Universitario o técnico sólido', scale.strong),
        makeOption('Secundaria + cursos / experiencia', scale.good),
        makeOption('Muy básico', scale.mid),
      ]),
      makeQuestion('canada_3', '¿Tienes experiencia laboral formal?', [
        makeOption('Sí, 3 años o más', scale.strong),
        makeOption('Sí, 1 a 2 años', scale.good),
        makeOption('Muy poca o informal', scale.weak),
      ]),
      makeQuestion('canada_4', '¿Qué nivel de inglés o francés tienes?', [
        makeOption('Intermedio alto / avanzado', scale.strong),
        makeOption('Intermedio', scale.good),
        makeOption('Bajo o nulo', scale.weak),
      ]),
      makeQuestion(
        'canada_5',
        '¿Tienes examen de idioma o estás listo para hacerlo?',
        [
          makeOption('Sí', scale.strong),
          makeOption('Aún no, pero puedo prepararlo pronto', scale.good),
          makeOption('No', scale.weak),
        ]
      ),
      makeQuestion('canada_6', '¿Tienes fondos para tu proceso?', [
        makeOption('Sí, fondos suficientes', scale.strong),
        makeOption('Parcialmente', scale.good),
        makeOption('No', scale.weak),
      ]),
      makeQuestion(
        'canada_7',
        '¿Tienes oferta laboral, admisión o vínculo con una provincia?',
        [
          makeOption('Sí', scale.strong),
          makeOption('Estoy en proceso', scale.good),
          makeOption('No', scale.mid),
        ]
      ),
      makeQuestion(
        'canada_8',
        '¿Has viajado, estudiado o vivido fuera antes?',
        [
          makeOption('Sí, varias veces', scale.strong),
          makeOption('Sí, algo', scale.good),
          makeOption('No', scale.mid),
        ]
      ),
      makeQuestion('canada_9', '¿Tienes familiares directos en Canadá?', [
        makeOption('Sí', scale.good),
        makeOption('No', scale.mid),
        makeOption('No sé / no aplica', scale.mid),
      ]),
      makeQuestion('canada_10', '¿Qué tan organizado está tu caso?', [
        makeOption('Muy organizado', scale.strong),
        makeOption('Medio organizado', scale.good),
        makeOption('Nada organizado', scale.weak),
      ]),
    ],
  },

  europa: {
    slug: 'europa',
    name: 'Europa',
    shortBlurb:
      'Evalúa si tu perfil se alinea con estudio, empleo o residencia en Europa.',
    heroTitle: 'Evalúa tu fortaleza migratoria para Europa',
    heroSubtitle:
      'Cada país europeo cambia, pero estas 10 preguntas te dan una base realista.',
    routes: ['Estudio', 'Trabajo', 'Blue Card', 'Familia', 'Residencia'],
    icon: '/icons/europa.ico',
    questions: [
      makeQuestion('europa_1', '¿Ya tienes un país europeo objetivo?', [
        makeOption('Sí, totalmente definido', scale.strong),
        makeOption('Tengo 2 o 3 opciones claras', scale.good),
        makeOption('No', scale.weak),
      ]),
      makeQuestion('europa_2', '¿Tu ruta principal está clara?', [
        makeOption('Sí: estudio, trabajo o familia', scale.strong),
        makeOption('Más o menos', scale.good),
        makeOption('No', scale.weak),
      ]),
      makeQuestion('europa_3', '¿Hablas el idioma del país o inglés funcional?', [
        makeOption('Sí, buen nivel', scale.strong),
        makeOption('Nivel básico/intermedio', scale.good),
        makeOption('No', scale.weak),
      ]),
      makeQuestion('europa_4', '¿Tienes título universitario o técnico?', [
        makeOption('Sí', scale.strong),
        makeOption('Sí, pero incompleto / dudoso', scale.good),
        makeOption('No', scale.mid),
      ]),
      makeQuestion('europa_5', '¿Tu perfil profesional está bien documentado?', [
        makeOption('Sí', scale.strong),
        makeOption('Parcialmente', scale.good),
        makeOption('No', scale.weak),
      ]),
      makeQuestion('europa_6', '¿Tienes oferta laboral, admisión o sponsor?', [
        makeOption('Sí', scale.strong),
        makeOption('Estoy cerca de obtenerlo', scale.good),
        makeOption('No', scale.mid),
      ]),
      makeQuestion('europa_7', '¿Tienes fondos para instalación o trámite?', [
        makeOption('Sí', scale.strong),
        makeOption('Parcialmente', scale.good),
        makeOption('No', scale.weak),
      ]),
      makeQuestion(
        'europa_8',
        '¿Has viajado antes a países Schengen o similares?',
        [
          makeOption('Sí', scale.strong),
          makeOption('No mucho', scale.good),
          makeOption('Nunca', scale.mid),
        ]
      ),
      makeQuestion('europa_9', '¿Tienes familiares o pareja en Europa?', [
        makeOption('Sí', scale.good),
        makeOption('No', scale.mid),
        makeOption('No aplica', scale.mid),
      ]),
      makeQuestion(
        'europa_10',
        '¿Tus documentos civiles están listos y vigentes?',
        [
          makeOption('Sí', scale.strong),
          makeOption('Casi todos', scale.good),
          makeOption('No', scale.weak),
        ]
      ),
    ],
  },

  otros: {
    slug: 'otros',
    name: 'Otros países',
    shortBlurb: 'Evalúa tu base inicial para destinos alternativos.',
    heroTitle: 'Evalúa tu fortaleza migratoria para otros destinos',
    heroSubtitle:
      'Útil para México, Latinoamérica, Asia u otras rutas que estés considerando.',
    routes: ['México', 'Latinoamérica', 'Asia', 'Oceanía', 'Nómada digital'],
    icon: '/icons/op.ico',
    questions: [
      makeQuestion('otros_1', '¿Ya definiste el país exacto al que quieres ir?', [
        makeOption('Sí', scale.strong),
        makeOption('Tengo 2 opciones', scale.good),
        makeOption('No', scale.weak),
      ]),
      makeQuestion('otros_2', '¿Cuál es tu objetivo principal?', [
        makeOption('Trabajo / estudio / familia bien definidos', scale.strong),
        makeOption('Tengo una idea general', scale.good),
        makeOption('No lo tengo claro', scale.weak),
      ]),
      makeQuestion('otros_3', '¿Tienes sponsor, familiar, oferta o admisión?', [
        makeOption('Sí', scale.strong),
        makeOption('Estoy gestionándolo', scale.good),
        makeOption('No', scale.mid),
      ]),
      makeQuestion('otros_4', '¿Qué nivel educativo tienes?', [
        makeOption('Universitario o técnico', scale.strong),
        makeOption('Secundaria + experiencia', scale.good),
        makeOption('Básico', scale.mid),
      ]),
      makeQuestion('otros_5', '¿Qué nivel de idioma tienes para ese destino?', [
        makeOption('Bueno', scale.strong),
        makeOption('Intermedio', scale.good),
        makeOption('Muy bajo o nulo', scale.weak),
      ]),
      makeQuestion('otros_6', '¿Tienes fondos disponibles?', [
        makeOption('Sí', scale.strong),
        makeOption('Parcialmente', scale.good),
        makeOption('No', scale.weak),
      ]),
      makeQuestion('otros_7', '¿Has viajado antes fuera de tu país?', [
        makeOption('Sí, varias veces', scale.strong),
        makeOption('Sí, alguna vez', scale.good),
        makeOption('Nunca', scale.mid),
      ]),
      makeQuestion(
        'otros_8',
        '¿Tienes pasaporte y documentos civiles al día?',
        [
          makeOption('Sí', scale.strong),
          makeOption('Casi todos', scale.good),
          makeOption('No', scale.weak),
        ]
      ),
      makeQuestion(
        'otros_9',
        '¿Has tenido rechazos o problemas migratorios antes?',
        [
          makeOption('No', scale.strong),
          makeOption('Uno menor', scale.mid),
          makeOption('Sí, varios o graves', scale.weak),
        ]
      ),
      makeQuestion('otros_10', '¿Qué tan flexible eres con la ruta o el país?', [
        makeOption('Muy flexible', scale.strong),
        makeOption('Algo flexible', scale.good),
        makeOption('Nada flexible', scale.mid),
      ]),
    ],
  },
}

export const resolveCountrySlug = (value: unknown): CountrySlug => {
  if (typeof value === 'string' && value in countries) {
    return value as CountrySlug
  }

  return DEFAULT_COUNTRY
}

export const getCountry = (slug: unknown): CountryConfig => {
  return countries[resolveCountrySlug(slug)]
}