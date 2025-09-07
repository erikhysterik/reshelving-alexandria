"use client";

import React from 'react'
import { Badge, Container, Row, Col, Breadcrumb, BreadcrumbItem, Card, Accordion, Button } from "react-bootstrap"
import Link from 'next/link'
import { deEntitize } from '../src/utils'
import SearchWidget from './SearchWidget'

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
            <Link href={`/legacy-library/tag/${v.trim() || 'unknown'}`}>{v.trim() || 'Unknown'}</Link>
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

function SendToNotionButton(props) {
  const [isLoading, setLoading] = React.useState(false);

  let body = JSON.stringify(
    {
      title: props.title,
      pubdate: props.publication_date,
      pagecount: props.pages,
      description: props.description,
      contentconsiderations: props.ccs,
      tags: props.tags,
      authorillustrator: props.author_illustrator
    }
  )

  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: body
  };

  React.useEffect(() => {
    if (isLoading) {
      fetch(`${process.env.GATSBY_LAMBDA_SAVE_URL}`, options).then(() => {
        setLoading(false);
      });
    }
  }, [isLoading]);

  const handleClick = () => setLoading(true);

  return (
    <Button
      variant="primary"
      disabled={isLoading}
      onClick={!isLoading ? handleClick : null}
    >
      {isLoading ? 'Saving...' : 'Send To Notion'}
    </Button>
  );
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
              <BreadcrumbItem>
                <Link href="/legacy-library">Legacy Library</Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link href="/legacy-library/books">Books</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>
                <Link href={`/legacy-library/book/${mysqlBook.reference || 'unknown'}`}>{deEntitize(mysqlBook.title)}</Link>
              </BreadcrumbItem>
            </Breadcrumb>
          </Col>
          <Col xs={2}>
            <SearchWidget indices={[{ name: `reshelvingalexandria`, title: `reshelvingalexandria` }]} />
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col lg="11" className="mb-4 mb-lg-5">
            <div>
              <h1 className="block-title">{deEntitize(mysqlBook.title)}</h1>
              <SendToNotionButton
                title={deEntitize(mysqlBook.title)}
                publication_date={mysqlBook.publication_date}
                pages={mysqlBook.pages}
                description={deEntitize(mysqlBook.description).replace( /(<([^>]+)>)/ig, '').trim().replace(/&/g, '&').replace(/&nbsp;/g, ' ').replace(/'/g, '\'').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"')}
                ccs={ccTypes.length ? ccTypes.map(x => x.cc).reduce((prev, cur) => prev + '\n' + deEntitize(cur)).replace( /(<([^>]+)>)/ig, '').trim().replace(/&/g, '&').replace(/&nbsp;/g, ' ').replace(/'/g, '\'').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"') : ""}
                tags={mysqlBook.subject ? mysqlBook.subject.split(',').filter(Boolean).map(x => x.trim().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())) : []}
                author_illustrator={(mysqlBook.bookauthors ? mysqlBook.bookauthors.map(x => deEntitize(x.first) + " " + deEntitize(x.last)) : []).concat(mysqlBook.bookillustrators ? mysqlBook.bookillustrators.map(x => deEntitize(x.first) + " " + deEntitize(x.last)) : [])}
              />
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
                    <Link href={`/legacy-library/author/${a.reference || 'unknown'}`}>
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
                      <Link href={`/legacy-library/author/${a.reference || 'unknown'}`}>
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
                    <Link href={`/legacy-library/books/published/${mysqlBook.noncirca_pub_date || 'unknown'}`}>
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
                      <Link href={`/legacy-library/series/${mysqlBook.series_reference || 'unknown'}`}>
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
              <Card.Body>
                <Card.Subtitle>Time Periods</Card.Subtitle>
                <div className="h5">
                  <Accordion defaultActiveKey={[0]} alwaysOpen>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>Major</Accordion.Header>
                      <Accordion.Body>
                        { mysqlBook.bookmajortimeperiods?.filter(Boolean).map((v, i) => (
                          <React.Fragment key={`major-${v.cs_rid || i}`}>
                            <Badge bg='info' text="light">
                              <Link href={`/legacy-library/books/timeperiod/major/${v.reference || 'unknown'}`}>{v.name?.trim() || 'Unknown'}</Link>
                            </Badge>
                            <span> </span>
                          </React.Fragment>
                        )) ?? ""}
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                      <Accordion.Header>Minor</Accordion.Header>
                      <Accordion.Body>
                        { mysqlBook.bookminortimeperiods?.filter(Boolean).map((v, i) => (
                          <React.Fragment key={`minor-${v.cs_rid || i}`}>
                            <Badge bg='info' text="light">
                              <Link href={`/legacy-library/books/timeperiod/${v.region || 'unknown'}/${v.reference || 'unknown'}`}>{v.name || 'Unknown'}</Link>
                            </Badge>
                            <span> </span>
                          </React.Fragment>
                        )) ?? ""}
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                      <Accordion.Header>Centuries</Accordion.Header>
                      <Accordion.Body>
                        { mysqlBook.bookcenturies?.filter(Boolean).map((v, i) => (
                          <React.Fragment key={`century-${v.cs_rid || i}`}>
                            <Badge bg='info' text="light">
                              <Link href={`/legacy-library/books/century/${v.reference || 'unknown'}`}>{v.name || 'Unknown'}</Link>
                            </Badge>
                            <span> </span>
                          </React.Fragment>
                        )) ?? ""}
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3">
                      <Accordion.Header>Decades</Accordion.Header>
                      <Accordion.Body>
                        { mysqlBook.bookdecades?.filter(Boolean).map((v, i) => (
                          <React.Fragment key={`decade-${v.cs_rid || i}`}>
                            <Badge bg='info' text="light">
                              <Link href={`/legacy-library/books/decade/${v.reference || 'unknown'}`}>{v.decade || 'Unknown'}</Link>
                            </Badge>
                            <span> </span>
                          </React.Fragment>
                        )) ?? ""}
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}