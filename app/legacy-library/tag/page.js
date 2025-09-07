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

export default function TagPage() {
  const router = useRouter()
  const [tags, setTags] = React.useState([])
  const [tagList, setTagList] = React.useState([])
  const [currPage, setCurrPage] = React.useState(1)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tags')
        const data = await response.json()
        setTags(data)
        setLoading(false)
        afterPageClicked(1, data)
      } catch (error) {
        console.error('Error fetching tags:', error)
        setLoading(false)
      }
    }

    fetchTags()
  }, [])

  const afterPageClicked = (page_number, tagData = tags) => {
    setCurrPage(page_number)

    let endex = Math.min((page_number * 50), tagData.length)
    setTagList(tagData.slice(((page_number - 1) * 50), endex))
  }

  const handleRowClick = (tag) => {
    router.push(`/legacy-library/tag/${slugify(tag)}`)
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
                    <Link href="/legacy-library/tag">Tags</Link>
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
                  <Title variant="hero">All Tags</Title>
                </Box>
              </Col>
            </Row>
            <Row>
              <Col>
                <CustomPagination
                  totPages={tags.length % 50 ? tags.length / 50 + 1 : tags.length / 50}
                  currentPage={currPage}
                  pageClicked={(ele) => {
                    afterPageClicked(ele, tags)
                  }}
                >
                  <Table striped bordered hover size="sm" variant="dark">
                    <thead>
                      <tr>
                        <th>Tag</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="2" className="text-center">
                            Loading tags...
                          </td>
                        </tr>
                      ) : tagList.length === 0 ? (
                        <tr>
                          <td colSpan="2" className="text-center">
                            No tags found.
                          </td>
                        </tr>
                      ) : (
                        tagList.map((tag, ind) => {
                          return (
                            <tr
                              style={{ cursor: "pointer" }}
                              key={tag.id + ind}
                              onClick={() => handleRowClick(tag.tag)}
                            >
                              <td>{tag.tag}</td>
                              <td>{tag.description || 'N/A'}</td>
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