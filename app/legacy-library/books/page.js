import React from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '../../../components/PageWrapper'
import SearchWidget from '../../../components/SearchWidget'
import CustomPagination from '../../../components/CustomPagination'
import { Container, Row, Col, Breadcrumb, BreadcrumbItem, Table } from "react-bootstrap"
import { Title, Box } from "../../../src/components/Core"
import styled from "styled-components"
import Link from 'next/link'
import { deEntitize } from '../../../src/utils'
import { getAllBooks } from '../../../lib/queries'

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
`

export default function BooksPage({ books }) {
  const router = useRouter()
  const [tagList, setTagList] = React.useState([])
  const [currPage, setCurrPage] = React.useState(1)

  React.useEffect(() => {
    afterPageClicked(1)
  }, [])

  const afterPageClicked = (page_number) => {
    setCurrPage(page_number)

    let endex = Math.min((page_number * 50), books.length)
    setTagList(books.slice(((page_number - 1) * 50), endex))
  }

  const handleRowClick = (reference) => {
    router.push(`/legacy-library/book/${slugify(reference)}`)
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
                  <BreadcrumbItem linkAs={Link} linkProps={{ href: '/legacy-library' }} title="Legacy Library" active={false}>
                    Legacy Library
                  </BreadcrumbItem>
                  <BreadcrumbItem linkAs={Link} linkProps={{ href: '/legacy-library/books' }} title="Books" active={true}>
                    Books
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
                  <Title variant="hero">All Books</Title>
                </Box>
              </Col>
            </Row>
            <Row>
              <Col>
                <CustomPagination
                  totPages={books.length % 50 ? books.length / 50 + 1 : books.length / 50}
                  currentPage={currPage}
                  pageClicked={(ele) => {
                    afterPageClicked(ele)
                  }}
                >
                  <Table striped bordered hover size="sm" variant="dark">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Published</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tagList.map((book, ind) => {
                        return (
                          <tr
                            style={{ cursor: "pointer" }}
                            key={book.cs_rid + ind}
                            onClick={() => handleRowClick(book.reference)}
                          >
                            <td>{deEntitize(book.title)}</td>
                            <td>
                              {deEntitize(book.bookauthors?.at(0)?.first ?? "")}{" "}
                              {deEntitize(book.bookauthors?.at(0)?.last ?? "")}
                            </td>
                            <td>{book.publication_date}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>
                </CustomPagination>
              </Col>
            </Row>
          </Container>
        </BoxStyled>
      </PageWrapper>
    </>
  )
}

export async function getStaticProps() {
  try {
    const books = await getAllBooks()
    return {
      props: {
        books
      },
      revalidate: 3600 // Regenerate every hour
    }
  } catch (error) {
    console.error('Error fetching books:', error)
    return {
      props: {
        books: []
      }
    }
  }
}

