import * as React from "react"
import { graphql } from "gatsby"
import PageWrapper from "../../components/PageWrapper";
import { Badge, Container, Row, Col, Breadcrumb, BreadcrumbItem, Card, Accordion } from "react-bootstrap";
import { Title, Box } from "../../components/Core";
import styled from "styled-components";
import { Link } from 'gatsby'
import { deEntitize, slugify } from "../../utils";

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
`;

function BookDetails(props) {
  const { mysqlBook } = props.data
  return (
    <>
      <PageWrapper footerDark>
          <BoxStyled>
          <div className="pt-5 mt-5"></div>
      <Container>
      <Row>
          <Breadcrumb>
          <BreadcrumbItem linkAs={Link} linkProps={{to: '/database'}} title="Database Home" active={false} >Database Home</BreadcrumbItem>
          <BreadcrumbItem linkAs={Link} linkProps={{to: '/books'}} title="Books" active={false} >Books</BreadcrumbItem>
          <BreadcrumbItem linkAs={Link} linkProps={{to: '/book/' + mysqlBook.reference}} title={deEntitize(mysqlBook.title)} active={true} >{deEntitize(mysqlBook.title)}</BreadcrumbItem>
          </Breadcrumb>
      </Row>
      <Row className="justify-content-center">
              <Col lg="11" className="mb-4 mb-lg-5">
              <Box pt={["40px", null, null, "75px"]}>
              <Box>
                    <Title variant="hero">{deEntitize(mysqlBook.title) + " - " + mysqlBook.sort_title}</Title>
                  </Box>
                  </Box>
              </Col>
            </Row>
            <Row>
      <Col md={4} xl={3}>
          <Card>
              <Card.Img variant="top" src="" />
              <Card.Body>
                  <Card.Title>
                      Details
                  </Card.Title>
              </Card.Body>
              <Card.Body>
                  <Card.Subtitle>
                      Author
                  </Card.Subtitle>
                  <div>
                  <Link to={"/"}>{mysqlBook.author}</Link>
                  </div>
              </Card.Body>
              <Card.Body>
                  <Card.Subtitle>
                      Illustrator
                  </Card.Subtitle>
                  <div>
                  <Link to={"/"}>{mysqlBook.illustrator}</Link>
                  </div>
              </Card.Body>
              <Card.Body>
                  <Card.Subtitle>
                      Publisher
                  </Card.Subtitle>
                  <Card.Text>{mysqlBook.publisher}</Card.Text>
                  <Card.Subtitle>
                      Date
                  </Card.Subtitle>
                  <Card.Text>{mysqlBook.publication_date}</Card.Text>
              </Card.Body>
          </Card>
      </Col>
      <Col md={8} xl={9}>
          <Card>
              <Card.Body>
              <Card.Subtitle>Description</Card.Subtitle>
              </Card.Body>
              <Card.Body dangerouslySetInnerHTML={{__html: mysqlBook.description}}>
              </Card.Body>
              <Card.Body>
              <Card.Subtitle>Content Considerations</Card.Subtitle>
              <Accordion>
                  {mysqlBook.disclaimers &&
                  <Accordion.Item eventKey="0">
                      <Accordion.Header>General</Accordion.Header>
                      <Accordion.Body dangerouslySetInnerHTML={{__html: mysqlBook.disclaimers}}>
                      </Accordion.Body>
                  </Accordion.Item>
                  }
                  {mysqlBook.cc_behavior &&
                  <Accordion.Item eventKey="1">
                      <Accordion.Header>Behavior</Accordion.Header>
                      <Accordion.Body dangerouslySetInnerHTML={{__html: mysqlBook.cc_behavior}}>
                      </Accordion.Body>
                  </Accordion.Item>
                  }
                  {mysqlBook.cc_discrimination &&
                  <Accordion.Item eventKey="2">
                      <Accordion.Header>Discrimination</Accordion.Header>
                      <Accordion.Body dangerouslySetInnerHTML={{__html: mysqlBook.cc_discrimination}}>
                      </Accordion.Body>
                  </Accordion.Item>
                  }
                  {mysqlBook.cc_health &&
                  <Accordion.Item eventKey="3">
                      <Accordion.Header>Emotional Health</Accordion.Header>
                      <Accordion.Body dangerouslySetInnerHTML={{__html: mysqlBook.cc_health}}>
                      </Accordion.Body>
                  </Accordion.Item>
                  }
                  {mysqlBook.cc_language &&
                  <Accordion.Item eventKey="4">
                      <Accordion.Header>Language</Accordion.Header>
                      <Accordion.Body dangerouslySetInnerHTML={{__html: mysqlBook.cc_language}}>
                      </Accordion.Body>
                  </Accordion.Item>
                  }
                  {mysqlBook.cc_magic &&
                  <Accordion.Item eventKey="5">
                      <Accordion.Header>Magic</Accordion.Header>
                      <Accordion.Body dangerouslySetInnerHTML={{__html: mysqlBook.cc_magic}}>
                      </Accordion.Body>
                  </Accordion.Item>
                  }
                  {mysqlBook.cc_religion &&
                  <Accordion.Item eventKey="6">
                      <Accordion.Header>Religion</Accordion.Header>
                      <Accordion.Body dangerouslySetInnerHTML={{__html: mysqlBook.cc_religion}}>
                      </Accordion.Body>
                  </Accordion.Item>
                  }
                  { mysqlBook.cc_science &&
                  <Accordion.Item eventKey="7">
                      <Accordion.Header>Science</Accordion.Header>
                      <Accordion.Body dangerouslySetInnerHTML={{__html: mysqlBook.cc_science}}>
                      </Accordion.Body>
                  </Accordion.Item>
                  }
                  { mysqlBook.cc_sexuality &&
                  <Accordion.Item eventKey="8">
                      <Accordion.Header>Sexuality</Accordion.Header>
                      <Accordion.Body dangerouslySetInnerHTML={{__html: mysqlBook.cc_sexuality}}>
                      </Accordion.Body>
                  </Accordion.Item>
                  }
                  { mysqlBook.cc_violence_weapons &&
                  <Accordion.Item eventKey="9">
                      <Accordion.Header>Violence</Accordion.Header>
                      <Accordion.Body dangerouslySetInnerHTML={{__html: mysqlBook.cc_violence_weapons}}>
                      </Accordion.Body>
                  </Accordion.Item>
                  }
              </Accordion>
              </Card.Body>
              <Card.Body>
              <Card.Subtitle>Subjects</Card.Subtitle>
              { mysqlBook.subject &&
              <Card.Title>
              { mysqlBook.subject?.split(',').map((v, i) => <><Badge key={i} bg='info' text="light"><Link to={"/tag/" + slugify(v.trim())}>{v.trim()}</Link></Badge><span> </span></>) ?? ""}
              </Card.Title>
              }
              </Card.Body>
              <Card.Body>
              <Card.Subtitle>Tags</Card.Subtitle>
              { mysqlBook.tags &&
              <Card.Title>
              { mysqlBook.tags?.split(',').map((v, i) => <><Badge key={i} bg='info' text="light"><Link to={"/tag/" + slugify(v.trim())}>{v.trim()}</Link></Badge><span> </span></>) ?? ""}
              </Card.Title>
              }
              </Card.Body>
              <Card.Body>
              <Card.Subtitle>Secondary Tags</Card.Subtitle>
              { mysqlBook.secondary_tags &&
              <Card.Title>
              { mysqlBook.secondary_tags?.split(',').map((v, i) => <><Badge key={i} bg='info' text="light"><Link to={"/tag/" + slugify(v.trim())}>{v.trim()}</Link></Badge><span> </span></>) ?? ""}
              </Card.Title>
              }
              </Card.Body>
              <Card.Body>
              <Card.Subtitle>Illustration Tags</Card.Subtitle>
              { mysqlBook.illustration_tags &&
              <Card.Title>
              { mysqlBook.illustration_tags?.split(',').map((v, i) => <><Badge key={i} bg='info' text="light"><Link to={"/tag/" + slugify(v.trim())}>{v.trim()}</Link></Badge><span> </span></>) ?? ""}
              </Card.Title>
              }
              </Card.Body>
          </Card>
      </Col>
  </Row>
      </Container>
      </BoxStyled>
      </PageWrapper>
    </>
    )
}

export default BookDetails

export const query = graphql`
  query($id: String!) {
    mysqlBook(id: { eq: $id }) {
      title
      description
      reference
      sort_title
      id
      secondary_name
      url
      reference
      author
      cc_behavior
      cc_discrimination
      cc_health
      cc_language
      cc_magic
      cc_religion
      cc_science
      cc_sexuality
      cc_violence_weapons
      illustrator
      online_link
      tags
      publisher
      publication_date
      disclaimers
      secondary_tags
      illustration_tags
      subject
    }
  }
`

