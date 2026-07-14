import { Copy, MessageSquareText } from 'lucide-react';

const SCRIPTS = [
  {
    id: 'pagamento-entrega',
    title: 'Pagamento na Entrega',
    content: `Infelizmente não conseguimos trabalhar com pagamento na entrega por questões de logística. Enviamos milhares de pedidos para todo o Brasil e esse modelo não se encaixa. Nós até tentamos, mas tivemos problemas com clonagem de cartão e entregadores não confiáveis.`
  },
  {
    id: 'golpe',
    title: 'Objeção: Golpe / Medo',
    content: `Ah, eu entendo a sua preocupação, ainda mais com tanta coisa acontecendo na internet, né? Mas pode ficar tranquilo(a). Nossa empresa é séria. Vou te enviar aqui todos os nossos dados, incluindo CNPJ, fotos e depoimentos de clientes reais que já receberam nossos produtos e tiveram ótimos resultados.
Estou aqui para te dar total segurança. Quero que você compre e durma com a consciência tranquila. Pode confiar!`
  },
  {
    id: 'garantia',
    title: 'Tem garantia?',
    content: `Tem sim! Nossa loja é autorizada e todo cliente tem a garantia de receber o produto direitinho, no prazo e com suporte total. Além disso, seguimos todos os protocolos de segurança, envio e rastreamento.
E mais: você tem meu suporte total aqui no WhatsApp. Para qualquer dúvida ou acompanhamento, pode contar comigo!`
  }
];

export default function ScriptsBoard({ onCopy }) {
  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      onCopy("Script copiado com sucesso!");
    } catch (err) {
      console.error(err);
      onCopy("Erro ao copiar script.");
    }
  };

  return (
    <div className="glass-panel folder-card" style={{ marginTop: '1.5rem' }}>
      <div className="folder-header" style={{ marginBottom: '1.5rem' }}>
        <h3><MessageSquareText size={20} className="text-accent" /> Scripts de Atendimento Rápidos</h3>
      </div>

      <div className="scripts-grid">
        {SCRIPTS.map(script => (
          <div key={script.id} className="script-card group">
            <div className="script-header">
              <h4>{script.title}</h4>
              <button 
                className="btn-secondary btn-sm"
                onClick={() => handleCopy(script.content)}
                title="Copiar Texto"
              >
                <Copy size={14} /> Copiar
              </button>
            </div>
            <div className="script-body">
              {script.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
