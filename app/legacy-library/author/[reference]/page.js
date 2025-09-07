"use client";

import { notFound } from 'next/navigation'
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

export default function AuthorPage({ params }) {
  const [author, setAuthor] = React.useState(null)
  const [books, setBooks] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await fetch(`/api/authors/${params.reference}`)
        if (response.ok) {
          const data = await response.json()
          setAuthor(data.author)
          setBooks(data.books)
        } else {
          notFound()
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching author:', error)
        setLoading(false)
      }
    }

    fetchAuthor()
  }, [params.reference])

  if (loading) {
    return (
      <PageWrapper footerDark>
        <Container>
          <Row className="justify-content-center">
            <Col lg="11" className="mb-4 mb-lg-5">
              <div className="text-center">Loading author...</div>
            </Col>
          </Row>
        </Container>
      </PageWrapper>
    )
  }

  if (!author) {
    notFound()
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
                    <Link href="/legacy-library/authors">Authors</Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem active>
                    <Link href={`/legacy-library/author/${author.reference || 'unknown'}`}>{`${deEntitize(author.first)} ${deEntitize(author.last)}`}</Link>
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
                  <Title variant="hero">{deEntitize(author.first)} {deEntitize(author.last)}</Title>
                </Box>
              </Col>
            </Row>
            <Row>
              <Col md={4} xl={3}>
                <Card>
                  <Card.Body>
                    <Card.Title>Author Details</Card.Title>
                  </Card.Body>
                  <Card.Body>
                    <Card.Subtitle>Name</Card.Subtitle>
                    <Card.Text>{deEntitize(author.first)} {deEntitize(author.last)}</Card.Text>
                  </Card.Body>
                  {author.nationality && (
                    <Card.Body>
                      <Card.Subtitle>Nationality</Card.Subtitle>
                      <Card.Text>{author.nationality}</Card.Text>
                    </Card.Body>
                  )}
                  {author.dates && (
                    <Card.Body>
                      <Card.Subtitle>Dates</Card.Subtitle>
                      <Card.Text>{author.dates}</Card.Text>
                    </Card.Body>
                  )}
                  {author.type && (
                    <Card.Body>
                      <Card.Subtitle>Type</Card.Subtitle>
                      <Card.Text>{author.type}</Card.Text>
                    </Card.Body>
                  )}
                </Card>
              </Col>
              <Col md={8} xl={9}>
                <Card>
                  <Card.Body>
                    <Card.Subtitle>Biography</Card.Subtitle>
                    {author.bio ? (
                      <Card.Body dangerouslySetInnerHTML={{ __html: deEntitize(author.bio) }} />
                    ) : (
                      <Card.Text>No biography available.</Card.Text>
                    )}
                  </Card.Body>
                  {books.length > 0 && (
                    <Card.Body>
                      <Card.Subtitle>Books by this Author</Card.Subtitle>
                      <ListGroup variant="flush">
                        {books.map((book) => (
                          <ListGroup.Item key={book.cs_rid}>
                            <Link href={`/legacy-library/book/${slugify(book.reference || 'unknown')}`}>
                              {deEntitize(book.title)}
                            </Link>
                            {book.publication_date && (
                              <small className="text-muted"> ({book.publication_date})</small>
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