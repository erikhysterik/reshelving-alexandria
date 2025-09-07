"use client";

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import PageWrapper from '../../../components/PageWrapper'
import SearchWidget from '../../../components/SearchWidget'
import { Container, Row, Col, Breadcrumb, BreadcrumbItem, Card, ListGroup, Badge } from "react-bootstrap"
import { Title, Box } from "../../../src/components/Core"
import styled from "styled-components"
import Link from 'next/link'
import { deEntitize } from '../../../src/utils'
import slugify from '@sindresorhus/slugify'
import algoliasearch from 'algoliasearch/lite'
import { InstantSearch, Hits, connectStateResults, connectPagination } from 'react-instantsearch-dom'

const searchIndices = [{ name: `reshelvingalexandria`, title: `reshelvingalexandria` }]

const BoxStyled = styled(Box)`
  .block-title {
    color: ${({ theme }) => theme.colors.dark};
    font-size: 21px;
    font-weight: 700;
    line-height: 34px;
  }

  p {
    color: ${({ theme }) => theme.colors.text};
    font-size: 16px;
    font-weight: 300;
    line-height: 28px;
    margin-bottom: 15px;
  }
`

const HitComponent = ({ hit }) => {
  if (!hit || !hit.reference) {
    return null
  }

  const slugifiedReference = slugify(hit.reference)
  if (!slugifiedReference || slugifiedReference === 'undefined' || slugifiedReference === 'null') {
    return null
  }

  return (
    <ListGroup.Item>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <Link href={`/legacy-library/book/${slugifiedReference}`}>
            <h5 style={{ marginBottom: '0.5rem', color: '#007bff', textDecoration: 'none' }}>
              {deEntitize(hit.title || 'Unknown Title')}
            </h5>
          </Link>
          {hit.author_first && hit.author_last && (
            <p style={{ marginBottom: '0.5rem', color: '#6c757d' }}>
              by {deEntitize(hit.author_first)} {deEntitize(hit.author_last)}
            </p>
          )}
          {hit.publication_date && (
            <p style={{ marginBottom: '0.5rem', fontSize: '0.9em', color: '#6c757d' }}>
              Published: {hit.publication_date}
            </p>
          )}
          {hit.description && (
            <p style={{ marginBottom: '0.5rem', fontSize: '0.9em' }}>
              {deEntitize(hit.description).substring(0, 200)}...
            </p>
          )}
          {hit.tags && (
            <div>
              {hit.tags.split(',').slice(0, 3).map((tag, index) => (
                <Badge key={index} bg="secondary" style={{ marginRight: '0.5rem', fontSize: '0.8em' }}>
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </ListGroup.Item>
  )
}

const CustomPaginationComponent = ({ currentRefinement, nbPages, refine }) => {
  if (nbPages <= 1) return null

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
      <nav>
        <ul className="pagination">
          {Array.from({ length: nbPages }, (_, index) => (
            <li key={index} className={`page-item ${currentRefinement === index ? 'active' : ''}`}>
              <button
                className="page-link"
                onClick={() => refine(index)}
                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

const CustomPagination = connectPagination(CustomPaginationComponent)

const SearchResults = ({ searchState, searchResults }) => {
  const hasQuery = searchState && searchState.query && searchState.query.trim() !== ''
  const hasResults = searchResults && searchResults.nbHits > 0

  // Debug logging
  React.useEffect(() => {
    console.log('SearchResults - searchState:', searchState)
    console.log('SearchResults - searchResults:', searchResults)
    console.log('SearchResults - hasQuery:', hasQuery)
    console.log('SearchResults - hasResults:', hasResults)
  }, [searchState, searchResults, hasQuery, hasResults])

  if (!hasQuery) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h4>Start searching for books...</h4>
        <p>Use the search box above to find books by title, author, or keywords.</p>
      </div>
    )
  }

  if (!hasResults) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h4>No results found</h4>
        <p>No books match your search for "{searchState.query}". Try different keywords.</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem', color: '#6c757d' }}>
        Found {searchResults.nbHits} result{searchResults.nbHits !== 1 ? 's' : ''} for "{searchState.query}"
      </div>
      <ListGroup variant="flush">
        <Hits hitComponent={HitComponent} />
      </ListGroup>
      <CustomPagination />
    </div>
  )
}

const ConnectedSearchResults = connectStateResults((props) => {
  console.log('ConnectedSearchResults props:', props)
  return <SearchResults {...props} />
})

function SearchPageContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [mounted, setMounted] = React.useState(false)
  const [searchResults, setSearchResults] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    // Debug logging
    console.log('Search page loaded with query:', query)
    console.log('Search params:', Object.fromEntries(searchParams.entries()))
    console.log('Algolia config:', {
      appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
      searchKey: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY,
      indexName: searchIndices[0].name
    })
  }, [query, searchParams])

  React.useEffect(() => {
    // Perform search when query changes
    if (query && mounted && searchClient) {
      setLoading(true)
      console.log('Performing search for:', query)
      searchClient.search([{
        indexName: searchIndices[0].name,
        query: query,
        params: {
          hitsPerPage: 20
        }
      }]).then(result => {
        console.log('Search completed:', result)
        setSearchResults(result.results[0])
        setLoading(false)
      }).catch(error => {
        console.error('Search error:', error)
        setLoading(false)
      })
    }
  }, [query, mounted])

  const searchClient = React.useMemo(
    () => {
      const client = algoliasearch(
        process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
        process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
      )

      // Add error handling and logging
      const originalSearch = client.search
      client.search = (...args) => {
        console.log('Algolia search called with:', args)
        return originalSearch.apply(client, args)
      }

      return client
    },
    []
  )

  return (
    <>
      <PageWrapper footerDark>
        <BoxStyled>
          <div className="pt-5 mt-5"></div>
          <Container>
            <Row className="d-flex align-items-center">
              <Col>
                <Breadcrumb>
                  <BreadcrumbItem>
                    <Link href="/legacy-library">Legacy Library</Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem active>
                    <Link href="/legacy-library/search">Search</Link>
                  </BreadcrumbItem>
                </Breadcrumb>
              </Col>
              <Col xs={2}>
                <SearchWidget className="float-end" indices={searchIndices} />
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col lg="11" className="mb-4 mb-lg-5">
                <Box>
                  <Title variant="hero">Search Results</Title>
                  {query && (
                    <div style={{ marginTop: '1rem', color: '#6c757d' }}>
                      <p>Searching for: <strong>"{query}"</strong></p>
                      <button
                        onClick={() => {
                          if (searchClient) {
                            searchClient.search([{
                              indexName: searchIndices[0].name,
                              query: query,
                              params: { hitsPerPage: 20 }
                            }]).then(result => {
                              console.log('Manual search result:', result)
                              alert(`Search completed! Found ${result.results[0]?.hits?.length || 0} results`)
                            }).catch(error => {
                              console.error('Manual search error:', error)
                              alert('Search failed: ' + error.message)
                            })
                          }
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Test Search
                      </button>
                    </div>
                  )}
                </Box>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card>
                  <Card.Body>
                    {!mounted ? (
                      <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div>Loading search...</div>
                      </div>
                    ) : loading ? (
                      <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div>Searching...</div>
                      </div>
                    ) : searchResults ? (
                      <div>
                        <div style={{ marginBottom: '1rem', color: '#6c757d' }}>
                          Found {searchResults.nbHits} result{searchResults.nbHits !== 1 ? 's' : ''} for "{query}"
                        </div>
                        <ListGroup variant="flush">
                          {searchResults.hits.map((hit, index) => (
                            <HitComponent key={hit.objectID || index} hit={hit} />
                          ))}
                        </ListGroup>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <h4>No results found</h4>
                        <p>No books match your search for "{query}". Try different keywords.</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </BoxStyled>
      </PageWrapper>
    </>
  )
}

export default function SearchPage() {
  return <SearchPageContent />
}