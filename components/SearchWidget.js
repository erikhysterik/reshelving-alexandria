"use client"

import algoliasearch from "algoliasearch/lite"
import { createRef, default as React, useState, useMemo } from "react"
import { InstantSearch } from "react-instantsearch-dom"
import { ThemeProvider } from "styled-components"
import { useRouter } from 'next/navigation'
import useClickOutside from "../src/components/SearchWidget/use-click-outside"
import StyledSearchBox from "../src/components/SearchWidget/styled-search-box"
import StyledSearchResult from "./StyledSearchResult"
import StyledSearchRoot from "../src/components/SearchWidget/styled-search-root"

const theme = {
  foreground: "#050505",
  background: "white",
  faded: "#888",
}

export default function SearchWidget({ indices }) {
  const rootRef = createRef()
  const [query, setQuery] = useState()
  const [hasFocus, setFocus] = useState(false)
  const router = useRouter()

  const searchClient = useMemo(
    () =>
      algoliasearch(
        process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
        process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
      ),
    []
  )

  const handleSearchStateChange = ({ query: newQuery }) => {
    setQuery(newQuery)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && query && query.trim()) {
      router.push(`/legacy-library/search?q=${encodeURIComponent(query.trim())}`)
      setFocus(false)
    }
  }

  useClickOutside(rootRef, () => setFocus(false))

  return (
    <ThemeProvider theme={theme}>
      <StyledSearchRoot ref={rootRef}>
        <InstantSearch
          searchClient={searchClient}
          indexName={indices[0].name}
          onSearchStateChange={handleSearchStateChange}
        >
          <StyledSearchBox
            onFocus={() => setFocus(true)}
            hasFocus={hasFocus}
            onKeyDown={handleKeyDown}
          />
          <StyledSearchResult
            show={query && query.length > 0 && hasFocus}
            indices={indices}
          />
        </InstantSearch>
      </StyledSearchRoot>
    </ThemeProvider>
  )
}