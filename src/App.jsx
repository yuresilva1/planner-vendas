import { useState, useEffect } from 'react';
import './App.css';
import { products } from './data/products';
import ProductCard from './components/ProductCard';
import ImageUploader from './components/ImageUploader';
import CpfGenerator from './components/CpfGenerator';
import { Target, Fingerprint, Info } from 'lucide-react';

function App() {
  const [showCpfModal, setShowCpfModal] = useState(false);
  const [toast, setToast] = useState(null);

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
    </div>
  );
}

export default App;
