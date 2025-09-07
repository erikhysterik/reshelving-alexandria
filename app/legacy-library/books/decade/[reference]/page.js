"use client";

import React from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '../../../../../components/PageWrapper'
import SearchWidget from '../../../../../components/SearchWidget'
import CustomPagination from '../../../../../components/CustomPagination'
import { Container, Row, Col, Breadcrumb, BreadcrumbItem, Table } from "react-bootstrap"
import { Title, Box } from "../../../../../src/components/Core"
import styled from "styled-components"
import Link from 'next/link'
import { deEntitize } from '../../../../../src/utils'
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

export default function DecadePage({ params }) {
  const router = useRouter()
  const [books, setBooks] = React.useState([])
  const [tagList, setTagList] = React.useState([])
  const [currPage, setCurrPage] = React.useState(1)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`/api/books/decade/${params.reference}`)
        const data = await response.json()
        setBooks(data)
        setLoading(false)
        afterPageClicked(1, data)
      } catch (error) {
        console.error('Error fetching books:', error)
        setLoading(false)
      }
    }

    fetchBooks()
  }, [params.reference])

  const afterPageClicked = (page_number, bookData = books) => {
    setCurrPage(page_number)

    let endex = Math.min((page_number * 50), bookData.length)
    setTagList(bookData.slice(((page_number - 1) * 50), endex))
  }

  const handleRowClick = (reference) => {
    router.push(`/legacy-library/book/${slugify(reference)}`)
  }

  const decadeName = books.length > 0 ? books[0].decade_name : params.reference

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
                    <Link href="/legacy-library/books">Books</Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem active>
                    <Link href={`/legacy-library/books/decade/${params.reference}`}>{deEntitize(decadeName || params.reference)}</Link>
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
                  <Title variant="hero">Books from the {deEntitize(decadeName || params.reference)}</Title>
                </Box>
              </Col>
            </Row>
            <Row>
              <Col>
                <CustomPagination
                  totPages={books.length % 50 ? books.length / 50 + 1 : books.length / 50}
                  currentPage={currPage}
                  pageClicked={(ele) => {
                    afterPageClicked(ele, books)
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
                      {loading ? (
                        <tr>
                          <td colSpan="3" className="text-center">
                            Loading books...
                          </td>
                        </tr>
                      ) : tagList.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="text-center">
                            No books found for the {params.reference}.
                          </td>
                        </tr>
                      ) : (
                        tagList.map((book, ind) => {
                          return (
                            <tr
                              style={{ cursor: "pointer" }}
                              key={book.cs_rid + ind}
                              onClick={() => handleRowClick(book.reference)}
                            >
                              <td>{deEntitize(book.title)}</td>
                              <td>
                                {deEntitize(book.author_first ?? "")}{" "}
                                {deEntitize(book.author_last ?? "")}
                              </td>
                              <td>{book.publication_date}</td>
                            </tr>
                          )
                        })
                      )}
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