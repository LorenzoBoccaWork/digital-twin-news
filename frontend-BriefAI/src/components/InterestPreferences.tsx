type InterestPreferencesProps = {
  selectedCategories: string[]
  onToggleCategory: (category: string) => void
  onSaveCategories: () => void
}

type CategoryOption = {
  label: string
  emoji: string
}

const categoryOptions: CategoryOption[] = [
  { label: 'AI', emoji: '🤖' },
  { label: 'Fintech', emoji: '💰' },
  { label: 'Startup', emoji: '🚀' },
  { label: 'Crypto', emoji: '₿' },
  { label: 'Tech', emoji: '💻' },
  { label: 'Energia Pulita', emoji: '⚡' },
  { label: 'Tecnologia Spaziale', emoji: '🛸' },
  { label: 'Biotecnologie', emoji: '🧬' },
]

// Sezione interessi: gestisce la selezione rapida delle categorie del feed.
function InterestPreferences({ selectedCategories, onToggleCategory, onSaveCategories }: InterestPreferencesProps) {
  return (
    <section className="settings-card" aria-label="Le tue categorie">
      <header className="settings-section-header">
        <div>
          <h2>Le tue categorie</h2>
          <p>Scegli i macro-temi che devono modellare il tuo feed.</p>
        </div>
      </header>

      <div className="category-grid">
        {categoryOptions.map((category) => {
          const isSelected = selectedCategories.includes(category.label)

          return (
            <button
              key={category.label}
              type="button"
              className={`category-tile ${isSelected ? 'selected' : ''}`}
              onClick={() => onToggleCategory(category.label)}
            >
              <span className="category-emoji" aria-hidden="true">
                {category.emoji}
              </span>
              <span className="category-label">{category.label}</span>
            </button>
          )
        })}
      </div>

      <div className="settings-action-row">
        <button type="button" className="settings-save-button" onClick={onSaveCategories}>
          <SaveIcon />
          Salva
        </button>
      </div>
    </section>
  )
}

function SaveIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4Z" />
      <path d="M7 3v6h8V3" />
      <path d="M7 21v-6h10v6" />
    </svg>
  )
}

export default InterestPreferences
