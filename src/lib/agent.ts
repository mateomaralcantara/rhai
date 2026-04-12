// src/lib/agent.ts
export type AgentResult =
  | { type: 'menu' }
  | { type: 'route'; destination: 'usa'|'canada'|'europa'|'otros' }
  | { type: 'text'; message: string };

const normalize = (s: string) =>
  s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

export async function runAgent(userText: string): Promise<AgentResult> {
  const s = normalize(userText);
  if (!s) return { type: 'menu' };

  if (/(usa|estados unidos|eeuu|ee\.uu|u\.s\.a)/.test(s)) return { type: 'route', destination: 'usa' };
  if (/(canada|canad[aá])/.test(s))                      return { type: 'route', destination: 'canada' };
  if (/(europa|schengen|ue|union europea|unión europea)/.test(s)) return { type: 'route', destination: 'europa' };
  if (/(otros|latam|sudamerica|sudamérica|resto)/.test(s)) return { type: 'route', destination: 'otros' };

  // Fallback a LLM si quieres algo más “smart”
  // return await llmAnswer(s);

  // Respuesta por defecto minimal
  return {
    type: 'text',
    message:
      'Soy tu asistente de RHAI 🙌. Puedo ayudarte con *Estados Unidos*, *Canadá*, *Europa* u *Otros países*. ' +
      'Escribe el país o responde *MENU* para ver opciones.'
  };
}
