import { list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  
  const { prefix } = req.query;
  
  try {
    const { blobs } = await list({
      prefix: prefix ? `${prefix}/` : '',
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    // Ordenar blobs do mais recente pro mais antigo baseado na data (uploadedAt)
    const sortedBlobs = blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    return res.status(200).json({ success: true, blobs: sortedBlobs });
  } catch (error) {
    console.error('List Error:', error);
    return res.status(500).json({ error: 'Falha ao listar imagens do Vercel Blob' });
  }
}
