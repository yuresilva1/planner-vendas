import { useState, useEffect } from 'react';
import './App.css';
import { products } from './data/products';
import ProductCard from './components/ProductCard';
import ImageUploader from './components/ImageUploader';
import CpfGenerator from './components/CpfGenerator';
import { Target, Fingerprint, Info, Bell, Trash2, Copy } from 'lucide-react';
import Pusher from 'pusher-js';

function App() {
  const [showCpfModal, setShowCpfModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [realtimeNotifications, setRealtimeNotifications] = useState([]);

  useEffect(() => {
    const pusherKey = import.meta.env.VITE_PUSHER_KEY || "SUA_KEY";
    const pusherCluster = import.meta.env.VITE_PUSHER_CLUSTER || "us2";

    if (pusherKey === "SUA_KEY") return; // Ignora se não estiver configurado

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster
    });

    const channel = pusher.subscribe('sales-planner');
    channel.bind('webhook-event', function(data) {
      const id = Date.now();
      setRealtimeNotifications(prev => [...prev, { id, message: data.message, phone: data.phone }]);
      // A notificação agora é persistente (não some sozinha)
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1><Target size={32} color="#10b981" /> <span>Sales</span>Planner</h1>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowCpfModal(true)}>
            <Fingerprint size={18} /> Gerador de CPF
          </button>
        </div>
      </header>

      <main className="main-grid">
        {/* Left Column: Affiliates */}
        <section>
          <h2 className="section-title">
            <Info size={20} /> Ofertas Moujarim
          </h2>
          <div className="products-grid">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onCopy={showToast} 
              />
            ))}
          </div>
        </section>

        {/* Right Column: Files */}
        <section className="folders-grid">
          <h2 className="section-title">
            Arquivos Úteis
          </h2>
          <ImageUploader 
            title="Finalização de Vendas" 
            storageKey="sales_images"
            onCopy={showToast}
          />
          <ImageUploader 
            title="Logística" 
            storageKey="logistic_images"
            onCopy={showToast}
          />
        </section>
      </main>

      {showCpfModal && (
        <CpfGenerator 
          onClose={() => setShowCpfModal(false)} 
          onCopy={showToast}
        />
      )}

      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}

      <div className="realtime-toast-container">
        {realtimeNotifications.map(n => {
          // Tenta extrair telefone da mensagem (DDI + DDD + Numero) caso não venha separado
          const phoneRegex = n.message.match(/55[0-9]{10,11}/);
          const phoneToCopy = n.phone || (phoneRegex ? phoneRegex[0] : n.message);

          return (
            <div key={n.id} className="realtime-toast">
              <div className="toast-content">
                <Bell size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>{n.message}</span>
              </div>
              <div className="toast-actions">
                <button 
                  className="btn-secondary" 
                  style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', borderRadius: '4px' }}
                  onClick={() => {
                    navigator.clipboard.writeText(phoneToCopy);
                    showToast("Contato copiado!");
                  }}
                >
                  <Copy size={12} /> Copiar Contato
                </button>
                <button 
                  className="btn-icon" 
                  style={{ color: '#ef4444', padding: '0.25rem' }}
                  onClick={() => setRealtimeNotifications(prev => prev.filter(item => item.id !== n.id))}
                  title="Excluir Lead"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
