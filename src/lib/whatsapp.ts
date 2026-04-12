// src/lib/whatsapp.ts
const GRAPH_URL = (phoneId: string) =>
    `https://graph.facebook.com/v20.0/${phoneId}/messages`;
  
  type SendTextOpts = { previewUrl?: boolean };
  
  export async function sendWhatsAppText(to: string, body: string, opts: SendTextOpts = {}) {
    const token = process.env.WHATSAPP_TOKEN!;
    const phoneId = process.env.WHATSAPP_PHONE_ID!;
    const res = await fetch(GRAPH_URL(phoneId), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body, preview_url: !!opts.previewUrl }
      })
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error(`WhatsApp sendText FAIL ${res.status}: ${t}`);
    }
    return res.json();
  }
  
  export async function sendWhatsAppInteractiveList(to: string) {
    const token = process.env.WHATSAPP_TOKEN!;
    const phoneId = process.env.WHATSAPP_PHONE_ID!;
    const payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'interactive',
      interactive: {
        type: 'list',
        header: { type: 'text', text: 'RHAI' },
        body:   { text: '¿A dónde quieres ir?' },
        footer: { text: 'Elige una opción 👇' },
        action: {
          button: 'Ver opciones',
          sections: [{
            title: 'Destinos',
            rows: [
              { id: 'usa',    title: 'Estados Unidos', description: 'Visas / Asesoría' },
              { id: 'canada', title: 'Canadá',         description: 'Visas / Asesoría' },
              { id: 'europa', title: 'Europa',         description: 'Schengen / Otros' },
              { id: 'otros',  title: 'Otros países',   description: 'LATAM / Más' }
            ]
          }]
        }
      }
    };
  
    const res = await fetch(GRAPH_URL(phoneId), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error(`WhatsApp list FAIL ${res.status}: ${t}`);
    }
    return res.json();
  }
  