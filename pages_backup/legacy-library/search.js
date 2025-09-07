import React, {useMemo} from 'react';
import { Container, Row, Col, Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import { Title, Box } from "../../components/Core";
import {
  InstantSearch,
  Hits,
  HitsPerPage,
  RefinementList,
  SearchBox,
  Stats,
  Pagination,
  Highlight,
  Snippet
} from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';
import { useQueryParam, StringParam } from 'use-query-params';
import SearchWidget from '../../components/SearchWidget'
import styled from "styled-components";
import { Link } from 'gatsby'
import PageWrapper from "../../components/PageWrapper";
const slugify = require('@sindresorhus/slugify')

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
`;

const PageHit = ({ hit }) => (
  <div>
    <Link to={"/legacy-library/book/" + slugify(hit.reference)}>
      <h4>
        <Highlight attribute="title" hit={hit} tagName="mark" />
      </h4>
    </Link>
    <Snippet attribute="excerpt" hit={hit} tagName="mark" />
  </div>
)

const Search = (props) => {

  const algoliaClient = useMemo(
    () =>
      algoliasearch(
        `${process.env.GATSBY_ALGOLIA_APP_ID}`,
        `${process.env.GATSBY_ALGOLIA_SEARCH_API_KEY}`
      ),
    []
  )

  const searchClient = {
    ...algoliaClient,
    search(requests) {
      if (requests.every(({ params }) => !params.query)) {
        return Promise.resolve({
          results: requests.map(() => ({
            hits: [],
            nbHits: 0,
            nbPages: 0,
            page: 0,
            processingTimeMS: 0,
          })),
        });
      }
      return algoliaClient.search(requests);
    }
  }
  
  const [q, setQ] = useQueryParam('q', StringParam);

  //console.log(q)

  /* { ...( q && { searchState: { query: q } } ) } */
  
  //research... can i pass results from the widget page to here through state???
  
  return (
    <>
      <PageWrapper footerDark>
          <BoxStyled>
          <div className="pt-5 mt-5"></div>
      <Container>
      <Row className="d-flex align-items-center">
        <Col >
          <Breadcrumb  >
          <BreadcrumbItem linkAs={Link} linkProps={{to: '/legacy-library'}} title="Legacy Library" active={true} >Legacy Library</BreadcrumbItem>
          <BreadcrumbItem linkAs={Link} linkProps={{to: '/legacy-library/books'}} title="Books" active={false} >Books</BreadcrumbItem>
         </Breadcrumb>
         </Col>
         <Col xs={2}>
         <SearchWidget className="float-end" indices={searchIndices} />
         </Col>
      </Row>
      <Row className="justify-content-center">
              <Col lg="11" className="mb-4 mb-lg-5">
              <Box>
                    <Title variant="hero">Legacy Library</Title>
                  </Box>
              </Col>
            </Row>
            <Row>
                <Col>
                <InstantSearch 
                   indexName={searchIndices[0].name}
                   searchClient={searchClient}
                   { ...( q && { searchState: { query: q } } ) }
                >
                   <SearchBox searchAsYouType={false} />
                   <Hits hitComponent={PageHit} />
                   
                </InstantSearch>
                </Col>
            </Row>
      </Container>
      </BoxStyled>
      </PageWrapper>
    </>

    
    )
}

export default Search