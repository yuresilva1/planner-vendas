import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.VITE_PUSHER_APP_ID || "COLOQUE_SEU_APP_ID",
  key: process.env.VITE_PUSHER_KEY || "COLOQUE_SUA_KEY",
  secret: process.env.VITE_PUSHER_SECRET || "COLOQUE_SEU_SECRET",
  cluster: process.env.VITE_PUSHER_CLUSTER || "us2",
  useTLS: true,
});

export default async function handler(req, res) {
  // CORS para permitir a chamada do n8n
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido (Apenas POST)' });
  }

  const { plan } = req.query;

  let message = "";
  if (plan === '10-meses') {
    message = "Cliente selecionou o parcelamento em 10 meses.";
  } else if (plan === '5-meses') {
    message = "Cliente selecionou o parcelamento em 5 meses.";
  } else if (plan === '3-meses') {
    message = "Cliente selecionou o parcelamento em 3 meses.";
  } else {
    return res.status(400).json({ error: 'Plano inválido' });
  }

  try {
    await pusher.trigger('sales-planner', 'webhook-event', { message });
    return res.status(200).json({ success: true, message: 'Notificação enviada com sucesso!' });
  } catch (error) {
    console.error('Erro no Pusher:', error);
    return res.status(500).json({ error: 'Falha ao enviar evento em tempo real' });
  }
}
