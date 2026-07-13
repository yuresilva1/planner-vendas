import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.VITE_PUSHER_APP_ID || "COLOQUE_SEU_APP_ID",
  key: process.env.VITE_PUSHER_KEY || "COLOQUE_SUA_KEY",
  secret: process.env.VITE_PUSHER_SECRET || "COLOQUE_SEU_SECRET",
  cluster: process.env.VITE_PUSHER_CLUSTER || "us2",
  useTLS: true,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Apenas POST é permitido' });
  }

  // Se o n8n enviar um texto no Body (JSON) ou na URL (?message=Texto), ele usa, senão usa o texto padrão.
  let customMessage = "Nova atualização ou clique recebido!";
  let phone = null;
  
  if (req.body) {
    if (req.body.message) customMessage = req.body.message;
    if (req.body.phone) phone = req.body.phone;
  } else if (req.query) {
    if (req.query.message) customMessage = req.query.message;
    if (req.query.phone) phone = req.query.phone;
  }

  try {
    await pusher.trigger('sales-planner', 'webhook-event', { message: customMessage, phone: phone });
    return res.status(200).json({ success: true, message: 'Notificação disparada' });
  } catch (error) {
    console.error('Erro no Pusher:', error);
    return res.status(500).json({ error: 'Falha ao enviar' });
  }
}
