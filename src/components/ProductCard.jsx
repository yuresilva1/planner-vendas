import { Copy, ChevronDown, ChevronUp, Link as LinkIcon, DollarSign } from 'lucide-react';

export default function ProductCard({ product, isExpanded, onToggle, onCopy }) {

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
        onClick={onToggle}
      >
        {isExpanded ? 'Ocultar Parcelas' : 'Ver Parcelas'}
      {product.installments && product.installments.length > 0 ? (
        <button 
          className="installments-btn" 
          onClick={onToggle}
        >
          {isExpanded ? 'Ocultar Parcelas' : 'Ver Parcelas'}
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      ) : (
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: 'var(--radius-sm)', textAlign: 'center', color: '#10b981', fontWeight: 'bold' }}>
          Pagamento na Entrega
        </div>
      )}

      {isExpanded && product.installments && product.installments.length > 0 && (
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
