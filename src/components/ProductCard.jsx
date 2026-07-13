import { useState } from 'react';
import { Copy, ChevronDown, ChevronUp, Link as LinkIcon, DollarSign } from 'lucide-react';

export default function ProductCard({ product, onCopy }) {
  const [showInstallments, setShowInstallments] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(product.link);
    onCopy("Link copiado com sucesso!");
  };

  return (
    <div className="glass-panel product-card">
      <div className="product-header">
        <div>
          <span className="product-title">Moujarim {product.title}</span>
          <div className="product-price">R$ {product.price}</div>
        </div>
        <DollarSign className="text-accent" size={24} color="#10b981" />
      </div>

      <div className="link-box">
        <LinkIcon size={16} />
        <input type="text" readOnly value={product.link} />
        <button className="btn-icon" onClick={handleCopyLink} title="Copiar Link">
          <Copy size={18} />
        </button>
      </div>

      <button 
        className="installments-btn" 
        onClick={() => setShowInstallments(!showInstallments)}
      >
        {showInstallments ? 'Ocultar Parcelas' : 'Ver Parcelas'}
        {showInstallments ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {showInstallments && (
        <div className="installments-table-container">
          <table className="installments-table">
            <thead>
              <tr>
                <th>Parcelas</th>
                <th>Valor</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {product.installments.map((inst, i) => (
                <tr key={i}>
                  <td>{inst.parcelas}</td>
                  <td>{inst.valor}</td>
                  <td>{inst.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
