import React from 'react'
import { Badge, Container, Row, Col, Breadcrumb, BreadcrumbItem, Card, Accordion } from "react-bootstrap"
import Link from 'next/link'
import { deEntitize } from '../src/utils'

function BookTags({ children }) {
  return (
    <Card.Body>
      <Card.Subtitle>Tags</Card.Subtitle>
      <div className="h5">
        {children && <Accordion defaultActiveKey={[0]} alwaysOpen>{children}</Accordion>}
        {!children && "N/A"}
      </div>
    </Card.Body>
  )
}

function TagSection({ tagkey, tags, header }) {
  return (
    <Accordion.Item eventKey={tagkey}>
      <Accordion.Header>{header}</Accordion.Header>
      <Accordion.Body>
        {tags?.split(',').filter(Boolean).map((v, i) => (
          <><Badge key={i} bg='info' text="light">
            <Link href={`/legacy-library/tag/${v.trim()}`}>{v.trim()}</Link>
          </Badge><span> </span></>
        )) ?? ""}
      </Accordion.Body>
    </Accordion.Item>
  )
}

function ContentConsideration({ tagkey, cc, header }) {
  return (
    <Accordion.Item eventKey={tagkey}>
      <Accordion.Header>{header}</Accordion.Header>
      <Accordion.Body dangerouslySetInnerHTML={{ __html: cc }} />
    </Accordion.Item>
  )
}

export default function BookDetails({ data }) {
  const { mysqlBook } = data

  const tagSections = [
    { tags: mysqlBook.subject, section: "Subjects" },
    { tags: mysqlBook.tags, section: "General" },
    { tags: mysqlBook.secondary_tags, section: "Secondary" },
    { tags: mysqlBook.illustration_tags, section: "Illustration" },
    { tags: mysqlBook.location, section: "Location" },
    { tags: mysqlBook.tale_name, section: "Tale Name" },
    {
      tags: [mysqlBook.lead_name, mysqlBook.lead_gender, mysqlBook.lead_race_ethnicity_nationality, mysqlBook.lead_age, mysqlBook.lead_religion, mysqlBook.lead_character, mysqlBook.lead_physical, mysqlBook.lead_vocation].filter(Boolean).join(","),
      section: "Lead Character"
    }
  ].filter((x) => x.tags)
  .map((v, i) => <TagSection key={i} tagkey={i} tags={v.tags} header={v.section} />)

  const ccTypes = [
    { cc: mysqlBook.disclaimers, header: "General" },
    { cc: (mysqlBook.cc_behavior ?? "") + (mysqlBook.new_cc_behavior ?? ""), header: "Behavior" },
    { cc: (mysqlBook.cc_discrimination ?? "") + (mysqlBook.new_cc_discrimination ?? ""), header: "Discrimination" },
    { cc: (mysqlBook.cc_health ?? "") + (mysqlBook.new_cc_health ?? ""), header: "Emotional Health" },
    { cc: (mysqlBook.cc_language ?? "") + (mysqlBook.new_cc_language ?? ""), header: "Language" },
    { cc: (mysqlBook.cc_magic ?? "") + (mysqlBook.new_cc_magic ?? ""), header: "Magic" },
    { cc: (mysqlBook.cc_religion ?? "") + (mysqlBook.new_cc_religion ?? ""), header: "Religion" },
    { cc: (mysqlBook.cc_science ?? "") + (mysqlBook.new_cc_science ?? ""), header: "Science" },
    { cc: (mysqlBook.cc_sexuality ?? "") + (mysqlBook.new_cc_sexuality ?? ""), header: "Sexuality" },
    { cc: (mysqlBook.cc_violence_weapons ?? "") + (mysqlBook.new_cc_violence_weapons ?? ""), header: "Violence" }
  ].filter((x) => x.cc)

  const ccSections = ccTypes.map((v, i) => (
    <ContentConsideration key={i} tagkey={i} cc={v.cc} header={v.header} />
  ))

  return (
    <div>
      <div className="pt-5 mt-5"></div>
      <Container>
        <Row className="d-flex align-items-center">
          <Col>
            <Breadcrumb>
              <BreadcrumbItem linkAs={Link} linkProps={{ href: '/legacy-library' }} title="Legacy Library">
                Legacy Library
              </BreadcrumbItem>
              <BreadcrumbItem linkAs={Link} linkProps={{ href: '/legacy-library/books' }} title="Books">
                Books
              </BreadcrumbItem>
              <BreadcrumbItem linkAs={Link} linkProps={{ href: `/legacy-library/book/${mysqlBook.reference}` }} title={deEntitize(mysqlBook.title)} active>
                {deEntitize(mysqlBook.title)}
              </BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col lg="11" className="mb-4 mb-lg-5">
            <div>
              <h1 className="block-title">{deEntitize(mysqlBook.title)}</h1>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={4} xl={3}>
            <Card>
              <Card.Body>
                <Card.Title>Details</Card.Title>
              </Card.Body>
              <Card.Body>
                <Card.Subtitle>Author{mysqlBook.bookauthors?.length > 1 && "s"}:</Card.Subtitle>
                {mysqlBook.bookauthors?.length > 0 ? mysqlBook.bookauthors?.map((a) => (
                  <div key={a.cs_rid}>
                    <Link href={`/legacy-library/author/${a.reference}`}>
                      {deEntitize(a.first) + " " + deEntitize(a.last)}
                    </Link>
                  </div>
                )) : <Card.Text>N/A</Card.Text>}
              </Card.Body>
              {mysqlBook.bookillustrators?.length > 0 && (
                <Card.Body>
                  <Card.Subtitle>Illustrator{mysqlBook.bookillustrators?.length > 1 && "s"}:</Card.Subtitle>
                  {mysqlBook.bookillustrators?.map((a) => (
                    <div key={a.cs_rid}>
                      <Link href={`/legacy-library/author/${a.reference}`}>
                        {deEntitize(a.first) + " " + deEntitize(a.last)}
                      </Link>
                    </div>
                  ))}
                </Card.Body>
              )}
              <Card.Body>
                <Card.Subtitle>Publisher:</Card.Subtitle>
                <Card.Text>{mysqlBook.publisher_name || "N/A"}</Card.Text>
                <Card.Subtitle>Date:</Card.Subtitle>
                {mysqlBook.publication_date ? (
                  <div>
                    <Link href={`/legacy-library/books/published/${mysqlBook.noncirca_pub_date}`}>
                      {mysqlBook.publication_date}
                    </Link>
                  </div>
                ) : <Card.Text>N/A</Card.Text>}
                <Card.Subtitle>Pages:</Card.Subtitle>
                <Card.Text>{mysqlBook.pages || "N/A"}</Card.Text>
                {mysqlBook.series_name && (
                  <>
                    <Card.Subtitle>Series:</Card.Subtitle>
                    <div>
                      <Link href={`/legacy-library/series/${mysqlBook.series_reference}`}>
                        {deEntitize(mysqlBook.series_name)}
                      </Link>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md={8} xl={9}>
            <Card>
              <Card.Body>
                <Card.Subtitle>Description</Card.Subtitle>
              </Card.Body>
              <Card.Body dangerouslySetInnerHTML={{ __html: mysqlBook.description }} />
              <Card.Body>
                <Card.Subtitle>Content Considerations</Card.Subtitle>
                {ccSections.length > 0 && (
                  <Accordion>
                    {ccSections}
                  </Accordion>
                )}
                {ccSections.length === 0 && <div className="h6">Not Provided</div>}
              </Card.Body>
              <BookTags>{tagSections}</BookTags>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}