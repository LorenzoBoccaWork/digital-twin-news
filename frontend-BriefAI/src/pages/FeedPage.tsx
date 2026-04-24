import FeedContent from '../components/FeedContent'
import FeedSidebar from '../components/FeedSidebar'
import FeedTopbar from '../components/FeedTopbar'
import './FeedPage.css'

function FeedPage() {
  return (
    <div className="feed-layout" aria-label="Feed BriefAI">
      <FeedSidebar activeItem="feed" />

      <section className="feed-main">
        <FeedTopbar showFeedFilters />
        <FeedContent />
      </section>
    </div>
  )
}

export default FeedPage
