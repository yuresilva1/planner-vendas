import { useState } from 'react';
import { X, Copy, RefreshCw } from 'lucide-react';

export default function CpfGenerator({ onClose, onCopy }) {
  const [cpf, setCpf] = useState(generateCpf());

  function generateCpf() {
    const randomDigit = () => Math.floor(Math.random() * 9);
    const n = Array.from({ length: 9 }, randomDigit);

    let d1 = n.reduce((total, number, index) => total + number * (10 - index), 0);
    d1 = 11 - (d1 % 11);
    if (d1 >= 10) d1 = 0;
    
    let d2 = d1 * 2;
    d2 += n.reduce((total, number, index) => total + number * (11 - index), 0);
    d2 = 11 - (d2 % 11);
    if (d2 >= 10) d2 = 0;

    const cpfStr = `${n.join('')}${d1}${d2}`;
    return `${cpfStr.slice(0, 3)}.${cpfStr.slice(3, 6)}.${cpfStr.slice(6, 9)}-${cpfStr.slice(9)}`;
  }

  const handleRefresh = () => {
    setCpf(generateCpf());
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cpf);
    onCopy("CPF copiado com sucesso!");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content">
        <button className="btn-icon modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <h2>Gerador de CPF</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Gere um CPF válido instantaneamente para testes.
        </p>

        <div className="cpf-display">
          <div className="cpf-value">{cpf}</div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleRefresh}>
            <RefreshCw size={18} /> Novo
          </button>
          <button className="btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={handleCopy}>
            <Copy size={18} /> Copiar CPF
          </button>
        </div>
      </div>
    </div>
  );
}
