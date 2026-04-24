type FeedTopbarProps = {
  showFeedFilters?: boolean
}

function FeedTopbar({ showFeedFilters = false }: FeedTopbarProps) {
  return (
    <header
      className={`feed-topbar ${showFeedFilters ? 'with-filters' : ''}`}
      aria-label="Intestazione feed"
    >
      {showFeedFilters ? (
        <nav className="feed-filter-nav" aria-label="Filtri feed">
          <label className="feed-filter-control" htmlFor="sentiment-filter">
            <span className="feed-filter-label">Sentiment</span>
            <select id="sentiment-filter" defaultValue="All Sentiment">
              <option>All Sentiment</option>
              <option>Positive</option>
              <option>Negative</option>
              <option>Neutral</option>
            </select>
          </label>

          <label className="feed-filter-control" htmlFor="topic-filter">
            <span className="feed-filter-label">Topics</span>
            <select id="topic-filter" defaultValue="All Topics">
              <option>All Topics</option>
              <option>AI</option>
              <option>Fintech</option>
              <option>Startup</option>
              <option>Crypto</option>
              <option>Tech</option>
            </select>
          </label>
        </nav>
      ) : null}
    </header>
  )
}

export default FeedTopbar
