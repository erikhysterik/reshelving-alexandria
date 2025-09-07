"use client";

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

export default function AuthorsPage() {
  const router = useRouter()
  const [authors, setAuthors] = React.useState([])
  const [tagList, setTagList] = React.useState([])
  const [currPage, setCurrPage] = React.useState(1)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch('/api/authors')
        const data = await response.json()
        setAuthors(data)
        setLoading(false)
        afterPageClicked(1, data)
      } catch (error) {
        console.error('Error fetching authors:', error)
        setLoading(false)
      }
    }

    fetchAuthors()
  }, [])

  const afterPageClicked = (page_number, authorData = authors) => {
    setCurrPage(page_number)

    let endex = Math.min((page_number * 50), authorData.length)
    setTagList(authorData.slice(((page_number - 1) * 50), endex))
  }

  const handleRowClick = (reference) => {
    router.push(`/legacy-library/author/${slugify(reference)}`)
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
                  <BreadcrumbItem active>
                    <Link href="/legacy-library/authors">Authors</Link>
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
                  <Title variant="hero">All Authors</Title>
                </Box>
              </Col>
            </Row>
            <Row>
              <Col>
                <CustomPagination
                  totPages={authors.length % 50 ? authors.length / 50 + 1 : authors.length / 50}
                  currentPage={currPage}
                  pageClicked={(ele) => {
                    afterPageClicked(ele, authors)
                  }}
                >
                  <Table striped bordered hover size="sm" variant="dark">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Nationality</th>
                        <th>Dates</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="4" className="text-center">
                            Loading authors...
                          </td>
                        </tr>
                      ) : tagList.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center">
                            No authors found.
                          </td>
                        </tr>
                      ) : (
                        tagList.map((author, ind) => {
                          return (
                            <tr
                              style={{ cursor: "pointer" }}
                              key={author.cs_rid + ind}
                              onClick={() => handleRowClick(author.reference)}
                            >
                              <td>{deEntitize(author.first)} {deEntitize(author.last)}</td>
                              <td>{author.type || 'N/A'}</td>
                              <td>{author.nationality || 'N/A'}</td>
                              <td>{author.dates || 'N/A'}</td>
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