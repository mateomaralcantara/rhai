export type ScoreBand = 'strong' | 'medium' | 'weak'

export function getBand(score: number): ScoreBand {
  if (score >= 75) return 'strong'
  if (score >= 55) return 'medium'
  return 'weak'
}

export function getRecommendation(score: number): string {
  const band = getBand(score)

  if (band === 'strong') {
    return 'Tu perfil muestra una base interesante. El siguiente paso correcto es revisar estrategia, documentos y ruta exacta.'
  }

  if (band === 'medium') {
    return 'Tu perfil tiene potencial, pero hay vacíos que conviene fortalecer antes de avanzar con todo.'
  }

  return 'Ahora mismo tu caso luce débil para aplicar sin estrategia. Primero conviene ordenar perfil, documentos y enfoque.'
}

export function getBandLabel(score: number): string {
  const band = getBand(score)

  if (band === 'strong') return 'Perfil fuerte'
  if (band === 'medium') return 'Perfil medio'
  return 'Perfil débil por ahora'
}