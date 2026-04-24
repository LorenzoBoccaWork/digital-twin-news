import { useState } from 'react'
import FeedSidebar from '../components/FeedSidebar'
import FeedTopbar from '../components/FeedTopbar'
import AccountSettings, { type SubscriptionState } from '../components/AccountSettings'
import InterestPreferences from '../components/InterestPreferences'
import SettingsTabs, { type SettingsTab } from '../components/SettingsTabs'
import TrackedKeywords from '../components/TrackedKeywords'
import './FeedPage.css'
import './SettingsPage.css'

type SettingsSnapshot = {
  selectedCategories: string[]
  keywords: string[]
  subscriptionState: SubscriptionState
}

const STORAGE_KEY = 'briefai-settings'
const ONBOARDING_KEY = 'briefai-onboarding'
const DEFAULT_CATEGORIES = ['AI', 'Fintech', 'Startup']

function readInitialSettings(): SettingsSnapshot {
  if (typeof window === 'undefined') {
    return {
      selectedCategories: DEFAULT_CATEGORIES,
      keywords: [],
      subscriptionState: 'free',
    }
  }

  const onboardingSnapshot = readJSON<{ selectedTopics?: string[]; keywords?: string[] }>(
    ONBOARDING_KEY,
  )
  const storedSnapshot = readJSON<Partial<SettingsSnapshot>>(STORAGE_KEY)

  return {
    selectedCategories:
      storedSnapshot?.selectedCategories ?? onboardingSnapshot?.selectedTopics ?? DEFAULT_CATEGORIES,
    keywords: storedSnapshot?.keywords ?? onboardingSnapshot?.keywords ?? [],
    subscriptionState: storedSnapshot?.subscriptionState ?? 'free',
  }
}

function readJSON<T>(storageKey: string): T | undefined {
  try {
    const rawValue = window.localStorage.getItem(storageKey)

    if (!rawValue) {
      return undefined
    }

    return JSON.parse(rawValue) as T
  } catch {
    return undefined
  }
}

function persistSettings(snapshot: SettingsSnapshot) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
}

// Pagina Impostazioni: gestisce preferenze feed e account con una struttura a tab.
function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('interests')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() =>
    readInitialSettings().selectedCategories,
  )
  const [keywords, setKeywords] = useState<string[]>(() => readInitialSettings().keywords)
  const [keywordInput, setKeywordInput] = useState('')
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>(
    () => readInitialSettings().subscriptionState,
  )

  const handleToggleCategory = (category: string) => {
    // Toggle semplice: se la categoria esiste la rimuove, altrimenti la aggiunge.
    setSelectedCategories((currentCategories) =>
      currentCategories.includes(category)
        ? currentCategories.filter((savedCategory) => savedCategory !== category)
        : [...currentCategories, category],
    )
  }

  const handleSaveCategories = () => {
    persistSettings({ selectedCategories, keywords, subscriptionState })
  }

  const handleAddKeyword = (rawKeyword: string) => {
    const cleanedKeyword = rawKeyword.trim()

    // Evita duplicati e valori vuoti per mantenere la lista leggibile.
    if (!cleanedKeyword || keywords.includes(cleanedKeyword)) {
      return
    }

    setKeywords((currentKeywords) => [...currentKeywords, cleanedKeyword])
    setKeywordInput('')
  }

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setKeywords((currentKeywords) =>
      currentKeywords.filter((savedKeyword) => savedKeyword !== keywordToRemove),
    )
  }

  const handleSaveKeywords = () => {
    persistSettings({ selectedCategories, keywords, subscriptionState })
  }

  const handleUpgrade = () => {
    const nextSubscriptionState: SubscriptionState = 'pro'
    setSubscriptionState(nextSubscriptionState)
    persistSettings({ selectedCategories, keywords, subscriptionState: nextSubscriptionState })
  }

  const handleCancelSubscription = () => {
    const nextSubscriptionState: SubscriptionState = 'free'
    setSubscriptionState(nextSubscriptionState)
    persistSettings({ selectedCategories, keywords, subscriptionState: nextSubscriptionState })
  }

  return (
    <div className="feed-layout settings-layout" aria-label="Impostazioni BriefAI">
      <FeedSidebar activeItem="impostazioni" />

      <section className="feed-main settings-main">
        <FeedTopbar />

        <div className="feed-content settings-content">
          <header className="settings-header">
            <h1>Impostazioni</h1>
            <p>Gestisci preferenze e profilo</p>
          </header>

          <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === 'interests' ? (
            <div className="settings-stack">
              <InterestPreferences
                selectedCategories={selectedCategories}
                onToggleCategory={handleToggleCategory}
                onSaveCategories={handleSaveCategories}
              />

              <TrackedKeywords
                keywords={keywords}
                keywordInput={keywordInput}
                onKeywordInputChange={setKeywordInput}
                onAddKeyword={handleAddKeyword}
                onRemoveKeyword={handleRemoveKeyword}
                onSaveKeywords={handleSaveKeywords}
              />
            </div>
          ) : (
            <AccountSettings
              username="John Doe"
              email="john@example.com"
              subscriptionState={subscriptionState}
              onUpgrade={handleUpgrade}
              onCancelSubscription={handleCancelSubscription}
            />
          )}
        </div>
      </section>
    </div>
  )
}

export default SettingsPage