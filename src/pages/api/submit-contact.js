export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    console.log('📨 Intentando enviar a FastAPI:', req.body);

    const fastapiRes = await fetch('http://127.0.0.1:8000/api/enviar-contacto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const fastapiData = await fastapiRes.json();
    console.log('✅ Respuesta de FastAPI:', fastapiData);

    if (!fastapiRes.ok) {
      return res.status(fastapiRes.status).json({ error: fastapiData.detail || 'Error del backend' });
    }

    return res.status(200).json({ success: true, message: 'Formulario enviado correctamente' });
  } catch (error) {
    console.error('❌ ERROR en submit-contact.js:', error);
    return res.status(500).json({ error: 'No se pudo conectar con FastAPI: ' + error.message });
  }
}
