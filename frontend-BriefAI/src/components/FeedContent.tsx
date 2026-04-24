import MagicCard from './MagicCard'

// Dati statici usati per simulare il feed in assenza di API reali.
const feedItems = [
  {
    source: 'TechCrunch',
    timeAgo: '2 ore fa',
    sentiment: 'Positivo' as const,
    title: 'Svolta epocale di OpenAI nella sicurezza dell\'IA',
    summary:
      'OpenAI presenta nuove misure di protezione per rendere i modelli più affidabili, con un focus particolare sulla prevenzione degli abusi e sulla governance tecnica.',
    tags: ['IA', 'Sicurezza'],
    entities: ['OpenAI', 'Sam Altman'],
  },
  {
    source: 'Bloomberg',
    timeAgo: '4 ore fa',
    sentiment: 'Positivo' as const,
    title: 'Startup Fintech: raccolti 12 miliardi nel primo trimestre',
    summary:
      'Il segmento fintech continua a crescere con round di finanziamento molto solidi, spinto dall\'interesse di fondi infrastrutturali e investitori strategici globali.',
    tags: ['Fintech', 'Startup'],
    entities: ['Stripe', 'Sequoia'],
  },
  {
    source: 'The Verge',
    timeAgo: '6 ore fa',
    sentiment: 'Negativo' as const,
    title: 'Tesla affronta ritardi nella produzione dei nuovi modelli',
    summary:
      'Problemi di supply chain e colli di bottiglia industriali rallentano il piano di lancio, alimentando incertezza sulle tempistiche delle consegne.',
    tags: ['Tech', 'Auto'],
    entities: ['Tesla', 'Elon Musk'],
  },
  {
    source: 'Wired',
    timeAgo: '8 ore fa',
    sentiment: 'Neutrale' as const,
    title: 'Il calcolo quantistico potrebbe trasformare la crittografia',
    summary:
      'Gli analisti valutano impatti, limiti e opportunità del quantum computing, evidenziando un percorso ancora lungo ma già rilevante per la sicurezza digitale.',
    tags: ['Tech', 'Quantum'],
    entities: ['Google', 'Quantum AI'],
  },
  {
    source: 'Fortune',
    timeAgo: '10 ore fa',
    sentiment: 'Positivo' as const,
    title: 'Anthropic valutata 25 miliardi nell\'ultimo round di finanziamento',
    summary:
      'La crescita della domanda per soluzioni di AI generativa porta nuove valutazioni record, con attenzione crescente alla qualità dei prodotti e alla monetizzazione.',
    tags: ['IA', 'Startup'],
    entities: ['Anthropic', 'Claude'],
  },
]

function FeedContent() {
  return (
    <section className="feed-content" aria-label="Contenuto feed">
      {/* Intestazione del feed: titolo e contesto editoriale della pagina. */}
      <header className="feed-header">
        <p className="feed-kicker">BriefAI Notizie</p>
        <h1>Il tuo flusso di intelligenza</h1>
        <p>Notizie personalizzate con approfondimenti AI</p>
      </header>

      {/* Lista verticale delle card: ogni elemento usa il componente MagicCard. */}
      <div className="feed-list">
        {feedItems.map((item) => (
          <MagicCard key={item.title} {...item} />
        ))}
      </div>

      <div className="feed-footer">
        {/* Bottone statico: al momento simula il caricamento di nuove notizie. */}
        <button type="button" className="load-more-button">
          Carica altre notizie
        </button>
      </div>
    </section>
  )
}

export default FeedContent
