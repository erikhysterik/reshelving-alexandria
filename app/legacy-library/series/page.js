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

export default function SeriesPage() {
  const router = useRouter()
  const [series, setSeries] = React.useState([])
  const [tagList, setTagList] = React.useState([])
  const [currPage, setCurrPage] = React.useState(1)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await fetch('/api/series')
        const data = await response.json()
        setSeries(data)
        setLoading(false)
        afterPageClicked(1, data)
      } catch (error) {
        console.error('Error fetching series:', error)
        setLoading(false)
      }
    }

    fetchSeries()
  }, [])

  const afterPageClicked = (page_number, seriesData = series) => {
    setCurrPage(page_number)

    let endex = Math.min((page_number * 50), seriesData.length)
    setTagList(seriesData.slice(((page_number - 1) * 50), endex))
  }

  const handleRowClick = (reference) => {
    router.push(`/legacy-library/series/${slugify(reference)}`)
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
                    <Link href="/legacy-library/series">Series</Link>
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
                  <Title variant="hero">All Series</Title>
                </Box>
              </Col>
            </Row>
            <Row>
              <Col>
                <CustomPagination
                  totPages={series.length % 50 ? series.length / 50 + 1 : series.length / 50}
                  currentPage={currPage}
                  pageClicked={(ele) => {
                    afterPageClicked(ele, series)
                  }}
                >
                  <Table striped bordered hover size="sm" variant="dark">
                    <thead>
                      <tr>
                        <th>Series Name</th>
                        <th>Publisher</th>
                        <th>Type</th>
                        <th>Books</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="4" className="text-center">
                            Loading series...
                          </td>
                        </tr>
                      ) : tagList.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center">
                            No series found.
                          </td>
                        </tr>
                      ) : (
                        tagList.map((seriesItem, ind) => {
                          return (
                            <tr
                              style={{ cursor: "pointer" }}
                              key={seriesItem.cs_rid + ind}
                              onClick={() => handleRowClick(seriesItem.reference)}
                            >
                              <td>{deEntitize(seriesItem.name)}</td>
                              <td>{seriesItem.publisher_name || 'N/A'}</td>
                              <td>{seriesItem.series_type || 'N/A'}</td>
                              <td>{seriesItem.pages || 'N/A'}</td>
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