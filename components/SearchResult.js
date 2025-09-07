import Link from "next/link"
import { default as React } from "react"
import {
  connectStateResults,
  Highlight,
  Hits,
  Index,
  Snippet,
} from "react-instantsearch-dom"
import slugify from '@sindresorhus/slugify'

const HitCount = connectStateResults(({ searchState, searchResults }) => {
  const hitCount = searchResults && searchResults.nbHits
  const query = searchState?.query || ''

  return hitCount > 0 ? (
    <div className="HitCount">
      <Link href={`/legacy-library/search/?q=${encodeURIComponent(query)}`}>
        {hitCount} result{hitCount !== 1 ? `s` : ``}
      </Link>
    </div>
  ) : null
})

const PageHit = ({ hit }) => {
  // More robust validation
  if (!hit) {
    return null
  }

  // Check if hit has the required properties
  const title = hit.title || hit._highlightResult?.title?.value || 'Untitled'
  const reference = hit.reference || hit.objectID

  if (!reference) {
    return null
  }

  const slugifiedReference = slugify(reference)
  if (!slugifiedReference || slugifiedReference === 'undefined' || slugifiedReference === 'null') {
    return null
  }

  return (
    <div>
      <Link href={`/legacy-library/book/${slugifiedReference}`}>
        <h4>
          <Highlight attribute="title" hit={hit} tagName="mark" />
        </h4>
      </Link>
      <Snippet attribute="excerpt" hit={hit} tagName="mark" />
    </div>
  )
}

const HitsInIndex = ({ index }) => (
  <Index indexName={index.name}>
    <HitCount />
    <Hits className="Hits" hitComponent={PageHit} />
  </Index>
)

const SearchResult = ({ indices, className }) => (
  <div className={className}>
    {indices.map(index => (
      <HitsInIndex index={index} key={index.name} />
    ))}
  </div>
)

export default SearchResult