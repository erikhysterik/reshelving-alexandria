"use client";

import React from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '../../../../components/PageWrapper'
import SearchWidget from '../../../../components/SearchWidget'
import { Container, Row, Col, Breadcrumb, BreadcrumbItem, Card, ListGroup } from "react-bootstrap"
import { Title, Box } from "../../../../src/components/Core"
import styled from "styled-components"
import Link from 'next/link'
import { deEntitize } from '../../../../src/utils'
import slugify from '@sindresorhus/slugify'

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

export default function SeriesDetailPage({ params }) {
  const router = useRouter()
  const [series, setSeries] = React.useState(null)
  const [books, setBooks] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await fetch(`/api/series/${params.reference}`)
        if (response.ok) {
          const data = await response.json()
          setSeries(data.series)
          setBooks(data.books)
        } else {
          router.push('/legacy-library/series')
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching series:', error)
        setLoading(false)
      }
    }

    fetchSeries()
  }, [params.reference])

  const handleBookClick = (reference) => {
    router.push(`/legacy-library/book/${slugify(reference)}`)
  }

  if (loading) {
    return (
      <PageWrapper footerDark>
        <Container>
          <Row className="justify-content-center">
            <Col lg="11" className="mb-4 mb-lg-5">
              <div className="text-center">Loading series...</div>
            </Col>
          </Row>
        </Container>
      </PageWrapper>
    )
  }

  if (!series) {
    return (
      <PageWrapper footerDark>
        <Container>
          <Row className="justify-content-center">
            <Col lg="11" className="mb-4 mb-lg-5">
              <div className="text-center">Series not found.</div>
            </Col>
          </Row>
        </Container>
      </PageWrapper>
    )
  }

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
                  <BreadcrumbItem>
                    <Link href="/legacy-library/series">Series</Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem active>
                    <Link href={`/legacy-library/series/${series.reference}`}>{deEntitize(series.name)}</Link>
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
                  <Title variant="hero">{deEntitize(series.name)}</Title>
                </Box>
              </Col>
            </Row>
            <Row>
              <Col md={4} xl={3}>
                <Card>
                  <Card.Body>
                    <Card.Title>Series Details</Card.Title>
                  </Card.Body>
                  <Card.Body>
                    <Card.Subtitle>Name</Card.Subtitle>
                    <Card.Text>{deEntitize(series.name)}</Card.Text>
                  </Card.Body>
                  {series.publisher_name && (
                    <Card.Body>
                      <Card.Subtitle>Publisher</Card.Subtitle>
                      <Card.Text>{series.publisher_name}</Card.Text>
                    </Card.Body>
                  )}
                  {series.series_type && (
                    <Card.Body>
                      <Card.Subtitle>Type</Card.Subtitle>
                      <Card.Text>{series.series_type}</Card.Text>
                    </Card.Body>
                  )}
                  {series.pages && (
                    <Card.Body>
                      <Card.Subtitle>Books in Series</Card.Subtitle>
                      <Card.Text>{series.pages}</Card.Text>
                    </Card.Body>
                  )}
                  {series.reading_level && (
                    <Card.Body>
                      <Card.Subtitle>Reading Level</Card.Subtitle>
                      <Card.Text>{series.reading_level}</Card.Text>
                    </Card.Body>
                  )}
                </Card>
              </Col>
              <Col md={8} xl={9}>
                <Card>
                  <Card.Body>
                    <Card.Subtitle>Description</Card.Subtitle>
                    {series.description ? (
                      <Card.Body dangerouslySetInnerHTML={{ __html: deEntitize(series.description) }} />
                    ) : (
                      <Card.Text>No description available.</Card.Text>
                    )}
                  </Card.Body>
                  {books.length > 0 && (
                    <Card.Body>
                      <Card.Subtitle>Books in this Series</Card.Subtitle>
                      <ListGroup variant="flush">
                        {books.map((book) => (
                          <ListGroup.Item
                            key={book.cs_rid}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleBookClick(book.reference)}
                          >
                            <Link href={`/legacy-library/book/${slugify(book.reference)}`}>
                              {deEntitize(book.title)}
                            </Link>
                            {book.publication_date && (
                              <small className="text-muted"> ({book.publication_date})</small>
                            )}
                            {book.author_first && book.author_last && (
                              <small className="text-muted">
                                {" "}by {deEntitize(book.author_first)} {deEntitize(book.author_last)}
                              </small>
                            )}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Card.Body>
                  )}
                </Card>
              </Col>
            </Row>
          </Container>
        </BoxStyled>
      </PageWrapper>
    </>
  )
}