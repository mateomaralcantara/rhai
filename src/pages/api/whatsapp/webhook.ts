// /src/pages/api/whatsapp/webhook.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: false, // necesitamos el raw body para validar firma
  },
};

function readRawBody(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN!;
  const APP_SECRET = process.env.WHATSAPP_APP_SECRET || '';

  if (req.method === 'GET') {
    // Verify callback
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send('Verification failed');
  }

  if (req.method === 'POST') {
    // Leer raw body
    const raw = await readRawBody(req);
    // Validar firma (opcional pero recomendado)
    const sig = req.headers['x-hub-signature-256'] as string | undefined;
    if (APP_SECRET && sig) {
      const expected = 'sha256=' + crypto.createHmac('sha256', APP_SECRET).update(raw).digest('hex');
      if (expected !== sig) return res.status(401).send('Invalid signature');
    }

    const body = JSON.parse(raw.toString('utf8') || '{}');

    // Extraer texto entrante
    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const msg = changes?.value?.messages?.[0];

    if (msg?.type === 'text') {
      const from = msg.from;           // número del usuario (E.164 sin +)
      const text = msg.text?.body || '';
      // Generar respuesta (IA o fija)
      const reply = await generateReply(text);

      await sendWhatsappText(from, reply);
    }

    return res.status(200).json({ status: 'ok' });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

async function generateReply(userText: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  if (!apiKey) {
    // fallback simple si no hay IA
    return `Recibido: "${userText}". En breve te contactamos.`;
  }

  // Llamada mínima a OpenAI REST (no dependemos de SDK)
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'Eres un asistente de RHAI para consultas migratorias. Responde breve y clara.' },
        { role: 'user', content: userText }
      ],
      temperature: 0.3,
      max_tokens: 180
    })
  });

  const j = await r.json();
  return j?.choices?.[0]?.message?.content?.trim() || 'Gracias por escribirnos. ¿En qué país te interesa?';
}

async function sendWhatsappText(to: string, body: string) {
  const token = process.env.WHATSAPP_TOKEN!;
  const phoneId = process.env.WHATSAPP_PHONE_ID!;
  const url = `https://graph.facebook.com/v20.0/${phoneId}/messages`;

  const r = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body }
    })
  });

  if (!r.ok) {
    const err = await r.text();
    console.error('[WA send error]', err);
    throw new Error('WhatsApp send failed');
  }
}
