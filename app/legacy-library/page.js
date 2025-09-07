"use client";

import React from 'react'
import PageWrapper from '../../components/PageWrapper'
import SearchWidget from '../../components/SearchWidget'
import { Container, Row, Col, Breadcrumb, BreadcrumbItem } from "react-bootstrap"
import { Title, Box } from "../../src/components/Core"
import styled from "styled-components"
import Link from 'next/link'

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

export default function LegacyLibraryPage() {
  return (
    <>
      <PageWrapper footerDark>
        <BoxStyled>
          <div className="pt-5 mt-5"></div>
          <Container>
            <Row className="d-flex align-items-center">
              <Col>
                <Breadcrumb>
                  <BreadcrumbItem linkAs={Link} linkProps={{ href: '/legacy-library' }} title="Legacy Library" active={true}>
                    Legacy Library
                  </BreadcrumbItem>
                  <BreadcrumbItem linkAs={Link} linkProps={{ href: '/legacy-library/books' }} title="Books" active={false}>
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
                  <Title variant="hero">Legacy Library</Title>
                </Box>
              </Col>
            </Row>
            <Row>
              <Col>
                {/* Content will be added here */}
              </Col>
            </Row>
          </Container>
        </BoxStyled>
      </PageWrapper>
    </>
  )
}

export async function generateMetadata() {
  return {
    title: 'Legacy Library',
    description: 'Browse our collection of books',
  }
}