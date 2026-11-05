import AttractionList from '../components/AttractionList'
import type { Place } from '../types/place'

type ExplorePageProps = {
  places: Place[]
}

function ExplorePage({ places }: ExplorePageProps) {
  return (
    <>
      <header className="page-header">
        <h1>Explore Manhattan</h1>
        <p>Discover attractions in Manhattan, New York.</p>
      </header>
      <AttractionList places={places} />
    </>
  )
}

export default ExplorePage
