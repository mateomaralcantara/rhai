// /src/pages/api/whatsapp/send.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { to, text } = req.body || {};
  if (!to || !text) return res.status(400).json({ ok: false, error: 'to y text requeridos' });

  const token = process.env.WHATSAPP_TOKEN!;
  const phoneId = process.env.WHATSAPP_PHONE_ID!;
  const url = `https://graph.facebook.com/v20.0/${phoneId}/messages`;

  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body: text } })
  });

  const j = await r.json();
  if (!r.ok) return res.status(r.status).json(j);
  res.status(200).json({ ok: true, meta: j });
}
