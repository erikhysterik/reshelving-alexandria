import { notFound } from 'next/navigation'
import { getAuthorByReference, getAllAuthorReferences, getAuthorBooks } from '../../../../lib/queries'
import PageWrapper from '../../../../components/PageWrapper'
import SearchWidget from '../../../../components/SearchWidget'
import { Container, Row, Col, Breadcrumb, BreadcrumbItem, Card, ListGroup } from "react-bootstrap"
import { Title, Box } from "../../../../src/components/Core"
import styled from "styled-components"
import Link from 'next/link'
import { deEntitize } from '../../../../src/utils'
import { slugify } from '@sindresorhus/slugify'

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

// Generate static paths for all authors
export async function generateStaticParams() {
  try {
    const references = await getAllAuthorReferences()
    return references.map((reference) => ({
      reference: reference,
    }))
  } catch (error) {
    console.error('Error generating static params for authors:', error)
    return []
  }
}

// Generate metadata for each author
export async function generateMetadata({ params }) {
  try {
    const author = await getAuthorByReference(params.reference)

    if (!author) {
      return {
        title: 'Author Not Found',
      }
    }

    return {
      title: `${deEntitize(author.first)} ${deEntitize(author.last)} - Author`,
      description: author.bio ? deEntitize(author.bio).substring(0, 160) : `Books by ${deEntitize(author.first)} ${deEntitize(author.last)}`,
    }
  } catch (error) {
    console.error('Error generating metadata for author:', error)
    return {
      title: 'Author Details',
    }
  }
}

export default async function AuthorPage({ params }) {
  try {
    const author = await getAuthorByReference(params.reference)

    if (!author) {
      notFound()
    }

    const authorBooks = await getAuthorBooks(author.cs_rid)

    return (
      <>
        <PageWrapper footerDark>
          <BoxStyled>
            <div className="pt-5 mt-5"></div>
            <Container>
              <Row className="d-flex align-items-center">
                <Col>
                  <Breadcrumb>
                    <BreadcrumbItem linkAs={Link} linkProps={{ href: '/legacy-library' }} title="Legacy Library" active={false}>
                      Legacy Library
                    </BreadcrumbItem>
                    <BreadcrumbItem linkAs={Link} linkProps={{ href: '/legacy-library' }} title="Legacy Library" active={false}>
                      Legacy Library
                    </BreadcrumbItem>
                    <BreadcrumbItem linkAs={Link} linkProps={{ href: `/legacy-library/author/${author.reference || 'unknown'}` }} title={`${deEntitize(author.first)} ${deEntitize(author.last)}`} active={true}>
                      {deEntitize(author.first)} {deEntitize(author.last)}
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
                    {authorBooks.length > 0 && (
                      <Card.Body>
                        <Card.Subtitle>Books by this Author</Card.Subtitle>
                        <ListGroup variant="flush">
                          {authorBooks.map((book) => (
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
  } catch (error) {
    console.error('Error loading author:', error)
    notFound()
  }
}