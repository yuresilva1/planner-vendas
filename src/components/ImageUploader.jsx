import { useState, useRef, useEffect } from 'react';
import { Upload, Copy, Image as ImageIcon, Trash2, Loader2 } from 'lucide-react';

export default function ImageUploader({ title, storageKey, onCopy }) {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Load from Vercel Blob via API
  const loadImages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/images/list?prefix=${storageKey}`);
      const data = await res.json();
      if (data.success && data.blobs) {
        setImages(data.blobs);
      }
    } catch (err) {
      console.error("Erro ao listar imagens da nuvem:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [storageKey]);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setIsUploading(true);

    for (const file of files) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target.result;
        
        try {
          const res = await fetch('/api/images/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              base64Data,
              filename: file.name,
              prefix: storageKey
            })
          });
          
          const data = await res.json();
          if (data.success) {
            setImages(prev => [data.blob, ...prev]);
            onCopy("Imagem salva na nuvem com sucesso!");
          }
        } catch (err) {
          console.error("Upload error:", err);
          onCopy("Erro ao enviar imagem para a nuvem.");
        }
      };
      reader.readAsDataURL(file);
    }
    
    setIsUploading(false);
  };

  const handleCopyImage = async (imgUrl) => {
    try {
      const res = await fetch(imgUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      onCopy("Imagem copiada para a área de transferência!");
    } catch (err) {
      console.error(err);
      onCopy("Erro ao copiar imagem. Verifique as permissões do navegador.");
    }
  };

  const handleDelete = async (url) => {
    try {
      const res = await fetch('/api/images/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      const data = await res.json();
      if (data.success) {
        setImages(prev => prev.filter(img => img.url !== url));
        onCopy("Imagem excluída da nuvem!");
      }
    } catch (err) {
      console.error(err);
      onCopy("Erro ao excluir imagem.");
    }
  };

  return (
    <div className="glass-panel folder-card">
      <div className="folder-header">
        <h3><ImageIcon size={20} className="text-accent" /> {title}</h3>
        <div className="upload-btn">
          <button className="btn-secondary" disabled={isUploading}>
            {isUploading ? <Loader2 size={16} className="spin" /> : <Upload size={16} />} 
            {isUploading ? 'Enviando...' : 'Upload'}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            multiple 
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </div>
      </div>

      <div className="images-grid">
        {isLoading && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            <Loader2 size={24} className="spin" style={{ margin: '0 auto 1rem' }} />
            Carregando imagens da nuvem...
          </div>
        )}
        
        {!isLoading && images.map(img => (
          <div key={img.url} className="image-item group">
            <img src={img.url} alt="Upload" />
            <div className="image-overlay">
              <button 
                className="btn-primary" 
                style={{ padding: '0.4rem', borderRadius: '50%' }}
                onClick={() => handleCopyImage(img.url)}
                title="Copiar Imagem"
              >
                <Copy size={16} />
              </button>
              <button 
                className="btn-icon" 
                style={{ color: '#ef4444', background: 'rgba(0,0,0,0.5)' }}
                onClick={() => handleDelete(img.url)}
                title="Deletar da Nuvem"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        
        {!isLoading && images.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            Nenhuma imagem enviada ainda.
          </div>
        )}
      </div>
    </div>
  );
}
