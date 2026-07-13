import { useState, useRef, useEffect } from 'react';
import { Upload, Copy, Image as ImageIcon, Trash2 } from 'lucide-react';

export default function ImageUploader({ title, storageKey, onCopy }) {
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  // Load from IndexedDB/LocalStorage logic (simplified to local state for now, but we use FileReader to keep data URLs)
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setImages(JSON.parse(saved));
    }
  }, [storageKey]);

  const saveImages = (newImages) => {
    setImages(newImages);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newImages));
    } catch (e) {
      console.warn("Storage limit reached");
    }
  };

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages(prev => {
          const updated = [...prev, { id: Date.now() + Math.random(), data: event.target.result }];
          saveImages(updated);
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCopyImage = async (dataUrl) => {
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      onCopy("Imagem copiada para a área de transferência!");
    } catch (err) {
      console.error(err);
      onCopy("Erro ao copiar imagem. Verifique permissões.");
    }
  };

  const handleDelete = (id) => {
    const filtered = images.filter(img => img.id !== id);
    saveImages(filtered);
  };

  return (
    <div className="glass-panel folder-card">
      <div className="folder-header">
        <h3><ImageIcon size={20} className="text-accent" /> {title}</h3>
        <div className="upload-btn">
          <button className="btn-secondary">
            <Upload size={16} /> Upload
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            multiple 
            accept="image/*"
            onChange={handleUpload}
          />
        </div>
      </div>

      <div className="images-grid">
        {images.map(img => (
          <div key={img.id} className="image-item group">
            <img src={img.data} alt="Upload" />
            <div className="image-overlay">
              <button 
                className="btn-primary" 
                style={{ padding: '0.4rem', borderRadius: '50%' }}
                onClick={() => handleCopyImage(img.data)}
                title="Copiar Imagem"
              >
                <Copy size={16} />
              </button>
              <button 
                className="btn-icon" 
                style={{ color: '#ef4444', background: 'rgba(0,0,0,0.5)' }}
                onClick={() => handleDelete(img.id)}
                title="Deletar"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            Nenhuma imagem enviada ainda.
          </div>
        )}
      </div>
    </div>
  );
}
