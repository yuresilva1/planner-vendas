import { del } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'Faltam a URL da imagem a deletar' });
  }

  try {
    await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN });
    return res.status(200).json({ success: true, message: 'Imagem excluída' });
  } catch (error) {
    console.error('Delete Error:', error);
    return res.status(500).json({ error: 'Falha ao excluir imagem do Vercel Blob' });
  }
}
