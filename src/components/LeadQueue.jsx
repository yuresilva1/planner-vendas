import { useState, useEffect } from 'react';
import { Copy, Trash2, Clock, Phone, XCircle, RefreshCw, CheckCircle, UserPlus, Archive, ArchiveRestore } from 'lucide-react';

const STATUS_CONFIG = {
  PENDING: { label: 'Pendente', color: '#3b82f6', icon: Clock },
  CALLED: { label: 'Já liguei', color: '#eab308', icon: Phone },
  NO_ANSWER: { label: 'Não atendeu', color: '#f97316', icon: XCircle },
  RETRY: { label: 'Tentar nov.', color: '#a855f7', icon: RefreshCw },
  DONE: { label: 'Feito', color: '#10b981', icon: CheckCircle },
};

export default function LeadQueue({ leads, setLeads, onCopy }) {
  const [showArchived, setShowArchived] = useState(false);
  
  const updateLeadField = (id, field, value) => {
    const updated = leads.map(lead => lead.id === id ? { ...lead, [field]: value } : lead);
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

  const filteredLeads = leads.filter(lead => showArchived ? lead.archived : !lead.archived);

  return (
    <div className="glass-panel folder-card panel-queue">
      <div className="folder-header" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h3><UserPlus size={20} className="text-accent" /> Fila de Atendimento</h3>
          <span className="badge">
            {leads.filter(l => !l.archived).length} ativos
          </span>
        </div>
        
        <button 
          className="btn-secondary" 
          onClick={() => setShowArchived(!showArchived)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {showArchived ? <UserPlus size={16} /> : <Archive size={16} />}
          {showArchived ? 'Ver Ativos' : 'Ver Arquivados'}
        </button>
      </div>

      {filteredLeads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
          {showArchived ? 'Nenhum lead arquivado ainda.' : 'Fila limpa! Nenhum lead pendente.'}
        </div>
      ) : (
        <div className="leads-list">
          {filteredLeads.map(lead => (
            <div key={lead.id} className="lead-item" style={{ borderLeftColor: STATUS_CONFIG[lead.status]?.color || '#3b82f6', opacity: lead.archived ? 0.7 : 1 }}>
              <div className="lead-content">
                <div className="lead-text">{lead.message}</div>
                <div className="lead-time">{new Date(lead.timestamp).toLocaleTimeString()}</div>
              </div>

              <textarea 
                className="lead-notes"
                placeholder="Adicionar anotação (salva sozinho)..."
                value={lead.notes || ''}
                onChange={(e) => updateLeadField(lead.id, 'notes', e.target.value)}
              />
              
              <div className="lead-controls">
                <select 
                  value={lead.status} 
                  onChange={(e) => updateLeadField(lead.id, 'status', e.target.value)}
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
                
                <button 
                  className="btn-secondary btn-sm" 
                  onClick={() => updateLeadField(lead.id, 'archived', !lead.archived)} 
                  title={lead.archived ? "Desarquivar" : "Arquivar"}
                >
                  {lead.archived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
                </button>

                <button className="btn-icon btn-sm text-danger" onClick={() => removeLead(lead.id)} title="Excluir Permanentemente">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
