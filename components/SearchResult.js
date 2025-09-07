import Link from "next/link"
import { default as React } from "react"
import {
  connectStateResults,
  Highlight,
  Hits,
  Index,
  Snippet,
} from "react-instantsearch-dom"
const slugify = require('@sindresorhus/slugify')

const HitCount = connectStateResults(({ searchState, searchResults }) => {
  const hitCount = searchResults && searchResults.nbHits

  return hitCount > 0 ? (
    <div className="HitCount">
      <Link href={`/legacy-library/search/?q=${searchState.query}`}>
        {hitCount} result{hitCount !== 1 ? `s` : ``}
      </Link>
    </div>
  ) : null
})

const PageHit = ({ hit }) => (
  <div>
    <Link href={`/legacy-library/book/${slugify(hit.reference)}`}>
      <h4>
        <Highlight attribute="title" hit={hit} tagName="mark" />
      </h4>
    </Link>
    <Snippet attribute="excerpt" hit={hit} tagName="mark" />
  </div>
)

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