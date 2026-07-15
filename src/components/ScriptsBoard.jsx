import { useState, useEffect } from 'react';
import { Copy, MessageSquareText, PhoneCall } from 'lucide-react';

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
  },
  {
    id: 'depois-falo',
    title: 'Objeção: Depois falo com você',
    content: `Será que consegue me confirmar no máximo em 1 hora? Porque como estamos em queima de estoque, essas unidades promocionais devem acabar rápido. Quero garantir que não fique sem e que aproveite o frete grátis!`
  },
  {
    id: 'cartao-vira',
    title: 'Objeção: Cartão vira tal dia',
    content: `Vamos agendar então para tal dia? Com seu pedido agendado eu consigo deixar reservado para a senhora com todas as condições que te passei, porque como estamos em queima de estoque vai acabar em breve... Pode ser?

[Se responder SIM]:
Me deixa seu endereço completo e seu nome por gentileza que já vou deixar agendado.`
  },
  {
    id: 'composicao',
    title: 'Objeção: Qual a composição? É natural?',
    content: `A nossa fórmula é 100% natural e super completa, olha só os ativos:
🌱 *Psyllium:* Expande no estômago e promove saciedade rápida, tirando a fome toda hora.
🛡️ *Cúrcuma:* Anti-inflamatório potente que faz o corpo queimar gordura com mais eficiência.
❌ *Quitosana:* Age como uma "esponja" no estômago, reduzindo a absorção de gordura da comida.
☕ *Cafeína:* Acelera o metabolismo e te dá muita disposição para o dia a dia.
🍊 *Laranja Moro:* O grande segredo para focar na queima daquela gordura localizada na barriga.
⚖️ *Cromo:* Diminui drasticamente aquela vontade incontrolável de comer doces e carboidratos.

Tudo pensado para te dar resultado rápido sem prejudicar a saúde! Ficou com alguma dúvida sobre eles?`
  },
  {
    id: 'pos-boleto',
    title: 'Pós Boleto Gerado',
    content: `Mandei o boleto das 3 formas: por foto, em PDF e também o código de barras (copia e cola). Assim que conseguir efetuar o pagamento me avisa, que já consigo adiantar o seu pedido na logística!`
  },
  {
    id: 'pos-pix',
    title: 'Pós PIX Gerado',
    content: `Mandei a chave PIX (Copia e Cola) logo acima para facilitar! Assim que concluir o pagamento, me avisa ou manda o comprovante aqui para eu já adiantar a separação do seu pedido na logística, combinado?`
  }
];

export default function ScriptsBoard({ onCopy }) {
  const [callScript, setCallScript] = useState(() => {
    return localStorage.getItem('dynamic_call_script') || `Olá, tudo bem? Me chamo Claudio Ruiz, estava em atendimento com você ali no WhatsApp, e achei melhor finalizarmos aqui por ligação para lhe passar total segurança na sua compra.\n\nFicou alguma dúvida em relação ao tratamento?`;
  });

  useEffect(() => {
    localStorage.setItem('dynamic_call_script', callScript);
  }, [callScript]);

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
    <div className="glass-panel folder-card panel-scripts" style={{ marginTop: '1.5rem' }}>
      <div className="folder-header" style={{ marginBottom: '1.5rem' }}>
        <h3><MessageSquareText size={20} className="text-accent" /> Scripts e Mensagens Rápidas</h3>
      </div>

      <div className="scripts-grid">
        
        {/* Script Dinâmico de Ligação no mesmo formato de grid pequeno */}
        <div className="script-card group">
          <div className="script-header">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <PhoneCall size={16} className="text-accent" /> Script de Ligação
            </h4>
            <button 
              className="btn-secondary btn-sm"
              onClick={() => handleCopy(callScript)}
              title="Copiar Script"
            >
              <Copy size={14} /> Copiar
            </button>
          </div>
          <div className="script-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <textarea 
              className="dynamic-script-input"
              value={callScript}
              onChange={(e) => setCallScript(e.target.value)}
              placeholder="Digite ou cole aqui o seu script de ligação..."
              style={{ flex: 1, border: 'none', padding: 0, minHeight: '120px', background: 'transparent' }}
            />
          </div>
        </div>

        {/* Scripts Estáticos */}
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
