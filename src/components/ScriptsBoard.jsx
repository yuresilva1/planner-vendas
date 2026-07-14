import { useState, useEffect } from 'react';
import { Copy, MessageSquareText, PhoneCall, Mic } from 'lucide-react';

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

const AUDIO_OBJECTIONS = [
  { title: 'Variação 1 - Comparativo de Investimento', content: `Oi [Nome], eu entendo perfeitamente que pode parecer um valor alto à primeira vista. Mas me conta uma coisa: quanto você já gastou com shakes, remédios ou tratamentos que não deram o resultado que você queria? O Mounjarim é diferente porque ele age na causa real do problema - e o melhor: você pode parcelar em até 12x no cartão ou pagar à vista com desconto. Não é um investimento que vale a pena pela sua saúde?` },
  { title: 'Variação 2 - Valor da Autoestima', content: `[Nome], eu sei que o preço pode assustar, mas pensa comigo: quanto vale poder usar aquela roupa que está guardada há tempos? Ou se olhar no espelho e se sentir incrível? O Mounjarim já ajudou centenas de mulheres como você, e hoje você ainda pode parcelar em 5x sem juros. Vamos fechar esse pedido e começar sua transformação?` },
  { title: 'Variação 3 - Custo-Benefício Diário', content: `Olha, [Nome], eu não vou dizer que é barato, mas vamos fazer uma conta rápida: um cafezinho gourmet por dia dá quase R$20. O Mounjarim CUSTA APENAS R$ POR MÊS e vai te ajudar a mudar seu corpo de verdade. Não é um ótimo negócio pra sua saúde?` },
  { title: 'Variação 4 - Economia a Longo Prazo', content: `[Nome], sério: já parou pra calcular quanto você gasta por ano com roupas novas (porque as antigas não servem) ou com produtos que não funcionam? O Mounjarim é um investimento que vai te fazer economizar tudo isso - e ainda vem com 30 dias de garantia. Se não amar, devolvemos seu dinheiro!` },
  { title: 'Variação 5 - Histórico de Gastos', content: `Me conta, [Nome]: na última vez que você comprou aquele shake ou creme 'milagroso', quanto gastou? E funcionou mesmo? O Mounjarim é 100% natural e comprovado cientificamente - por isso esse valor. Mas hoje ainda consigo te oferecer frete grátis! O que acha?` },
  { title: 'Variação 6 - Saúde vs. Preço', content: `[Nome], vou ser sincera: se fosse um produto qualquer, eu até entenderia. Mas o Mounjarim é sobre sua saúde e autoestima. Você merece esse cuidado! E olha que legal: dá pra pagar só quando o produto chegar na sua casa. Topa experimentar?` },
  { title: 'Variação 7 - Oferta Exclusiva', content: `Oi [Nome], essa oferta com desconto é só pra quem recebeu essa MENSAGEM - amanhã volta ao preço normal. Então me diz: qual é o valor de finalmente emagrecer com segurança e naturalmente? Pensa com carinho, tá?` },
  { title: 'Variação 8 - Facilidades de Pagamento', content: `[Nome], eu entendo seu lado! Por isso consegui condições especiais pra você: pode parcelar em até 12x, pagar na entrega E ainda tem 30 dias pra testar. Se não ver resultados, a gente te devolve o dinheiro! Justo, né?` },
  { title: 'Variação 9 - Prova Social', content: `Escuta só, [Nome]: semana passada, a Ana (42 anos) me disse a mesma coisa sobre o preço. Ela resolveu tentar e, em 1 mês, perdeu 4kg sem passar fome! Quer que eu te mande o depoimento em áudio dela?` },
  { title: 'Variação 10 - Última Chance', content: `[Nome], vou ser transparente: essa oferta com frete grátis e desconto vale só até hoje. Amanhã não posso garantir. E aí, vai deixar essa oportunidade passar?` }
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
    <div className="glass-panel folder-card" style={{ marginTop: '1.5rem' }}>
      <div className="folder-header" style={{ marginBottom: '1.5rem' }}>
        <h3><MessageSquareText size={20} className="text-accent" /> Scripts e Mensagens Rápidas</h3>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div className="script-header" style={{ marginBottom: '1rem', borderBottom: 'none', paddingBottom: 0 }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
            <PhoneCall size={18} className="text-accent" /> Script Principal de Ligação (Editável)
          </h4>
          <button 
            className="btn-primary btn-sm"
            onClick={() => handleCopy(callScript)}
            title="Copiar Script de Ligação"
          >
            <Copy size={14} /> Copiar
          </button>
        </div>
        <textarea 
          className="dynamic-script-input"
          value={callScript}
          onChange={(e) => setCallScript(e.target.value)}
          placeholder="Digite ou cole aqui o seu script de ligação... (ele é salvo automaticamente)"
        />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', marginBottom: '1rem' }}>
          <Mic size={18} className="text-accent" /> Áudios para Quebra de Objeção: "Está Caro"
        </h4>
        <div className="accordion-list">
          {AUDIO_OBJECTIONS.map((obj, i) => (
            <details key={i} className="script-accordion">
              <summary>
                <span>{obj.title}</span>
                <button 
                  className="btn-secondary btn-sm" 
                  onClick={(e) => { 
                    e.preventDefault(); // Impede de abrir/fechar ao clicar no botão
                    handleCopy(obj.content); 
                  }}
                >
                  <Copy size={14} /> Copiar
                </button>
              </summary>
              <div className="accordion-content">
                {obj.content}
              </div>
            </details>
          ))}
        </div>
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
