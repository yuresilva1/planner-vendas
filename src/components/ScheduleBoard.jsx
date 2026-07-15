import { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Copy } from 'lucide-react';

export default function ScheduleBoard({ onCopy }) {
  const [schedules, setSchedules] = useState(() => {
    const saved = localStorage.getItem('sales_schedules_list');
    if (saved) return JSON.parse(saved);
    
    // Default example if empty
    return [{
      id: Date.now(),
      product: 'Mounjarim',
      value: '297,00',
      text: `[22:02, 14/07/2026] +55 64 9214-2881: Iris de Fátima Silva Rodrigues\n[22:02, 14/07/2026] +55 64 9214-2881: Rua João Rodrigues Jota número 70\n[22:02, 14/07/2026] +55 64 9214-2881: Itumbiara Goiás\n[22:03, 14/07/2026] +55 64 9214-2881: 75530-370`
    }];
  });

  useEffect(() => {
    localStorage.setItem('sales_schedules_list', JSON.stringify(schedules));
  }, [schedules]);

  const addSchedule = () => {
    setSchedules([{ id: Date.now(), text: '', product: '', value: '' }, ...schedules]);
  };

  const updateSchedule = (id, field, val) => {
    setSchedules(schedules.map(s => s.id === id ? { ...s, [field]: val } : s));
  };

  const removeSchedule = (id) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  const handleCopy = async (sch) => {
    const textToCopy = `Produto: ${sch.product || 'Não informado'} | Valor: R$ ${sch.value || '0,00'}\n\nDados do Cliente:\n${sch.text}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      onCopy("Agendamento copiado com sucesso!");
    } catch (err) {
      console.error(err);
      onCopy("Erro ao copiar.");
    }
  };

  const todayDateStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const todayShortStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

  return (
    <div className="glass-panel folder-card panel-queue" style={{ marginTop: '1.5rem' }}>
      <div className="folder-header" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={20} className="text-accent" /> Agendamentos
        </h3>
        <button 
          className="btn-primary btn-sm" 
          onClick={addSchedule}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={16} /> Novo Agendamento
        </button>
      </div>

      <div className="leads-list">
        {schedules.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            Nenhum agendamento ativo.
          </div>
        ) : (
          schedules.map(sch => {
            const isToday = sch.text.includes(todayDateStr) || sch.text.includes(todayShortStr);
            return (
              <div 
                key={sch.id} 
                className={`lead-item ${isToday ? 'notify-card' : ''}`} 
                style={{ borderLeftColor: isToday ? '#ef4444' : '#10b981', padding: '1rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 600, color: isToday ? '#ef4444' : 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {isToday && <span className="badge bg-danger" style={{ animation: 'pulseWarning 2s infinite' }}>HOJE!</span>}
                    {isToday ? 'Agendado para Hoje' : 'Agendamento'}
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-secondary btn-sm" onClick={() => handleCopy(sch)} title="Copiar Tudo">
                      <Copy size={14} />
                    </button>
                    <button className="btn-icon btn-sm text-danger" onClick={() => removeSchedule(sch.id)} title="Excluir">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input 
                    type="text" 
                    placeholder="Nome do Produto" 
                    value={sch.product || ''} 
                    onChange={(e) => updateSchedule(sch.id, 'product', e.target.value)}
                    style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                  <input 
                    type="text" 
                    placeholder="Valor (R$)" 
                    value={sch.value || ''} 
                    onChange={(e) => updateSchedule(sch.id, 'value', e.target.value)}
                    style={{ width: '120px', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>

                <textarea 
                  className="lead-notes"
                  value={sch.text}
                  onChange={(e) => updateSchedule(sch.id, 'text', e.target.value)}
                  placeholder="Cole os dados do cliente e a data aqui (salva sozinho)..."
                  style={{ minHeight: '100px', width: '100%', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)' }}
                />
              </div>
            )
          })
        )}
      </div>
    </div>
  );
}
