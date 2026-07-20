import { useState } from 'react';
import { Calendar, Plus, Trash2, Copy, Save } from 'lucide-react';

export default function ScheduleBoard({ onCopy }) {
  const [schedules, setSchedules] = useState(() => {
    const saved = localStorage.getItem('sales_schedules_list');
    if (saved) {
      // Migrate old data if necessary or just load it
      return JSON.parse(saved);
    }
    
    // Default example if empty
    return [{
      id: Date.now(),
      clientName: 'Iris de Fátima Silva Rodrigues',
      clientPhone: '+55 64 9214-2881',
      clientAddress: 'Rua João Rodrigues Jota número 70, Itumbiara Goiás, 75530-370',
      product: 'Mounjarim',
      value: '297,00',
      scheduleDate: new Date().toISOString().split('T')[0], // Hoje por padrão
      notes: ''
    }];
  });

  const saveSchedules = () => {
    const uppercased = schedules.map(sch => ({
      ...sch,
      clientName: (sch.clientName || '').toUpperCase(),
      clientPhone: (sch.clientPhone || '').toUpperCase(),
      clientAddress: (sch.clientAddress || '').toUpperCase(),
      product: (sch.product || '').toUpperCase(),
      value: (sch.value || '').toUpperCase()
    }));
    
    setSchedules(uppercased);
    localStorage.setItem('sales_schedules_list', JSON.stringify(uppercased));
    onCopy("Agendamentos salvos!");
  };

  const addSchedule = () => {
      setSchedules([{ 
      id: Date.now(), 
      clientName: '',
      clientPhone: '',
      clientAddress: '',
      product: '', 
      value: '', 
      scheduleDate: ''
    }, ...schedules]);
  };

  const updateSchedule = (id, field, val) => {
    setSchedules(schedules.map(s => s.id === id ? { ...s, [field]: val } : s));
  };

  const removeSchedule = (id) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  const handleCopy = async (sch) => {
    let dateStr = 'Não definida';
    if (sch.scheduleDate) {
      const [y, m, d] = sch.scheduleDate.split('-');
      dateStr = `${d}/${m}/${y}`;
    }

    const textToCopy = `✅ *Agendamento Confirmado!*
Olha aqui, fiz o seu agendamento no meu sistema e já deixei tudo reservado para você:

👤 *Cliente:* ${sch.clientName || 'Não informado'}
📱 *Telefone:* ${sch.clientPhone || 'Não informado'}
📦 *Produto:* ${sch.product || 'Não informado'}
💰 *Valor Combinado:* R$ ${sch.value || '0,00'}
📅 *Data do Agendamento:* ${dateStr}

📍 *Endereço de Entrega:*
${sch.clientAddress || 'Não informado'}

Qualquer dúvida, estou à disposição! 🚀`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      onCopy("Agendamento copiado com sucesso!");
    } catch (err) {
      console.error(err);
      onCopy("Erro ao copiar.");
    }
  };

  const todayISOStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const todayDateStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const todayShortStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

  return (
    <div className="glass-panel folder-card panel-queue" style={{ marginTop: '1.5rem' }}>
      <div className="folder-header" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={20} className="text-accent" /> Agendamentos
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn-secondary btn-sm" 
            onClick={saveSchedules}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #10b981', color: '#10b981' }}
          >
            <Save size={16} /> Salvar
          </button>
          <button 
            className="btn-primary btn-sm" 
            onClick={addSchedule}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Plus size={16} /> Novo
          </button>
        </div>
      </div>

      <div className="leads-list">
        {schedules.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            Nenhum agendamento ativo.
          </div>
        ) : (
          schedules.map(sch => {
            // Check if today matches either explicit date or mention in notes
            const isToday = (sch.scheduleDate && sch.scheduleDate === todayISOStr) 
                            || (sch.notes && sch.notes.includes(todayDateStr)) 
                            || (sch.notes && sch.notes.includes(todayShortStr));
            return (
              <div 
                key={sch.id} 
                className={`lead-item ${isToday ? 'notify-card' : ''}`} 
                style={{ borderLeftColor: isToday ? '#ef4444' : '#10b981', padding: '1rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 600, color: isToday ? '#ef4444' : 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {isToday && <span className="badge bg-danger" style={{ animation: 'pulseWarning 2s infinite' }}>HOJE!</span>}
                    {isToday ? 'Lembrete: Entrar em contato HOJE' : 'Lembrete de Agendamento'}
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
                
                <div className="schedule-row">
                  <input 
                    type="text" 
                    placeholder="Nome do Cliente" 
                    value={sch.clientName || ''} 
                    onChange={(e) => updateSchedule(sch.id, 'clientName', e.target.value)}
                    className="schedule-input"
                  />
                  <input 
                    type="text" 
                    placeholder="Telefone (WhatsApp)" 
                    value={sch.clientPhone || ''} 
                    onChange={(e) => updateSchedule(sch.id, 'clientPhone', e.target.value)}
                    className="schedule-input"
                  />
                </div>

                <div style={{ marginBottom: '0.5rem' }}>
                  <input 
                    type="text" 
                    placeholder="Endereço Completo (Rua, Número, Bairro, Cidade-UF, CEP)" 
                    value={sch.clientAddress || ''} 
                    onChange={(e) => updateSchedule(sch.id, 'clientAddress', e.target.value)}
                    className="schedule-input"
                  />
                </div>

                <div className="schedule-row">
                  <input 
                    type="date" 
                    value={sch.scheduleDate || ''} 
                    onChange={(e) => updateSchedule(sch.id, 'scheduleDate', e.target.value)}
                    className="schedule-input"
                    title="Data do Agendamento / Lembrete"
                    style={{ flex: '0 0 auto', width: 'auto' }}
                  />
                  <input 
                    type="text" 
                    placeholder="Nome do Produto" 
                    value={sch.product || ''} 
                    onChange={(e) => updateSchedule(sch.id, 'product', e.target.value)}
                    className="schedule-input"
                    style={{ flex: 2 }}
                  />
                  <input 
                    type="text" 
                    placeholder="Valor (R$)" 
                    value={sch.value || ''} 
                    onChange={(e) => updateSchedule(sch.id, 'value', e.target.value)}
                    className="schedule-input"
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
}
