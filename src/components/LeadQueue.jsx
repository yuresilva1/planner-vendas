import { useState, useEffect } from 'react';
import { Copy, Trash2, Clock, Phone, XCircle, RefreshCw, CheckCircle, UserPlus } from 'lucide-react';

const STATUS_CONFIG = {
  PENDING: { label: 'Pendente', color: '#3b82f6', icon: Clock },
  CALLED: { label: 'Já liguei', color: '#eab308', icon: Phone },
  NO_ANSWER: { label: 'Não atendeu', color: '#f97316', icon: XCircle },
  RETRY: { label: 'Tentar nov.', color: '#a855f7', icon: RefreshCw },
  DONE: { label: 'Feito', color: '#10b981', icon: CheckCircle },
};

export default function LeadQueue({ leads, setLeads, onCopy }) {
  
  const updateStatus = (id, newStatus) => {
    const updated = leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead);
    setLeads(updated);
  };

  const removeLead = (id) => {
    setLeads(leads.filter(lead => lead.id !== id));
  };

  const handleCopy = async (lead) => {
    const phoneRegex = lead.message.match(/55[0-9]{10,11}/);
    const phoneToCopy = lead.phone || (phoneRegex ? phoneRegex[0] : lead.message);
    try {
      await navigator.clipboard.writeText(phoneToCopy);
      onCopy("Contato copiado!");
    } catch (err) {
      console.error(err);
      onCopy("Erro ao copiar.");
    }
  };

  if (leads.length === 0) return null;

  return (
    <div className="glass-panel folder-card">
      <div className="folder-header">
        <h3><UserPlus size={20} className="text-accent" /> Fila de Atendimento</h3>
        <span className="badge">
          {leads.length} leads
        </span>
      </div>

      <div className="leads-list">
        {leads.map(lead => (
          <div key={lead.id} className="lead-item" style={{ borderLeftColor: STATUS_CONFIG[lead.status]?.color || '#3b82f6' }}>
            <div className="lead-content">
              <div className="lead-text">{lead.message}</div>
              <div className="lead-time">{new Date(lead.timestamp).toLocaleTimeString()}</div>
            </div>
            
            <div className="lead-controls">
              <select 
                value={lead.status} 
                onChange={(e) => updateStatus(lead.id, e.target.value)}
                className="status-select"
                style={{ color: STATUS_CONFIG[lead.status]?.color || '#fff' }}
              >
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <option key={key} value={key} style={{ color: '#000' }}>{config.label}</option>
                ))}
              </select>
              
              <button className="btn-secondary btn-sm" onClick={() => handleCopy(lead)} title="Copiar">
                <Copy size={14} />
              </button>
              <button className="btn-icon btn-sm text-danger" onClick={() => removeLead(lead.id)} title="Excluir">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
