import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { base64Data, filename, prefix } = req.body;
  if (!base64Data || !filename || !prefix) {
    return res.status(400).json({ error: 'Faltam dados da imagem' });
  }

  try {
    // A string base64 geralmente vem no formato "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
    // Precisamos pegar apenas a parte depois da vírgula para converter para Buffer
    const base64Content = base64Data.split(',')[1];
    const buffer = Buffer.from(base64Content, 'base64');
    
    const blob = await put(`${prefix}/${Date.now()}-${filename}`, buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN // A Vercel injeta isso automaticamente
    });

    return res.status(200).json({ success: true, blob });
  } catch (error) {
    console.error('Upload Error:', error);
    return res.status(500).json({ error: 'Falha ao fazer upload para o Vercel Blob' });
  }
}
