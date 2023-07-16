import * as React from "react"
import { graphql } from "gatsby"
import PageWrapper from "../../../components/PageWrapper";
import { Badge, Container, Row, Col, Breadcrumb, BreadcrumbItem, Card, Accordion, Button } from "react-bootstrap";
import { Title, Box } from "../../../components/Core";
import styled from "styled-components";
import { Link } from 'gatsby'
import { deEntitize } from "../../../utils";
import SearchWidget from '../../../components/SearchWidget'

const slugify = require('@sindresorhus/slugify');

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
`;

function AuthorDetails(props) {
  const { authordetails, authorreldetails } = props.data
  
  // todo - canonical. what is they? just pseudonyms? how does the data relationship go, 1 way?
  const authorRelationships = authordetails.authorrelationships.filter((s) => s.cs_type === 'relationship').map((x) => {
    // relationship in author rel record is relative to self "wife of"
    // get the relationship for display from the relative's record
    let d = authorreldetails.edges.find((y) => y.node.cs_rid === x.author2_id);
    let r = d.node.authorrelationships.find((z) => authordetails.cs_rid === z.author2_id);

    return {
        // capitalize the Relationship entry
        relationship: r.relationship && r.relationship.length ? 
           r.relationship.trim().replace(/^./, r.relationship[0].toUpperCase()) : "",
        first: d.node.first,
        last: d.node.last,
        reference: d.node.reference
    }
  })

  // split and array concat the 2 alt name fields that are using inconsistent delims
  const altNames = (authordetails.alternate_name?.split(/\;|\,/).map((x) => x.trim()).filter((y) => y !== '') ?? []).concat(
    (authordetails.hidden_alternate?.split(/\;|\,/).map((x) => x.trim()).filter((y) => y !== '') ?? [])
  )
  
  return (
    <>
      <PageWrapper footerDark>
          <BoxStyled>
          <div className="pt-5 mt-5"></div>
      <Container>
      <Row className="d-flex align-items-center">
        <Col>
          <Breadcrumb>
          <BreadcrumbItem linkAs={Link} linkProps={{to: '/legacy-library'}} title="Legacy Library" active={false} >Legacy Library</BreadcrumbItem>
          <BreadcrumbItem linkAs={Link} linkProps={{to: '/legacy-library/authors'}} title="Authors" active={false} >Authors</BreadcrumbItem>
          <BreadcrumbItem linkAs={Link} linkProps={{to: '/legacy-library/author/' + slugify(authordetails.reference)}} title={deEntitize(authordetails.first) + " " + deEntitize(authordetails.last)} active={true} >{deEntitize(authordetails.first) + " " + deEntitize(authordetails.last)}</BreadcrumbItem>
          </Breadcrumb>
         </Col>
         <Col xs={2}>
         <SearchWidget className="float-end" indices={searchIndices} />
         </Col>
      </Row>
      <Row className="justify-content-center">
              <Col lg="11" className="mb-4 mb-lg-5">
              <Box>
                    <Title variant="hero">{deEntitize(authordetails.first) + " " + deEntitize(authordetails.last)}</Title>
                    <h3>{authordetails.dates}</h3>
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
              { authordetails.type &&
              <Card.Body>
                  <Card.Subtitle>
                      Type:
                  </Card.Subtitle>
                  <Card.Text>{authordetails.type.replace(/^./, authordetails.type[0].toUpperCase())}</Card.Text>
              </Card.Body>}
              { authordetails.pronunciation &&
              <Card.Body>
                  <Card.Subtitle>
                      Pronunciation:
                  </Card.Subtitle>
                  <Card.Text>{authordetails.pronunciation}</Card.Text>
              </Card.Body>}
              { altNames.length > 0 &&
              <Card.Body>
                  <Card.Subtitle>
                      Alternate Name{ altNames.length > 1 && "s"}:
                  </Card.Subtitle>
                  <Card.Text>
                  { altNames.length > 0 && altNames.map((x) => (
                  <div>{x}</div>))}
                  </Card.Text> 
              </Card.Body>}
              { authordetails.fixedbirthdate !== '0000-00-00' && authordetails.fixedbirthdate &&
              <Card.Body>
                  <Card.Subtitle>
                      Birth Date:
                  </Card.Subtitle>
                  <Card.Text>{new Date(authordetails.fixedbirthdate).toLocaleDateString('en-US', {month: 'long', day: 'numeric'})}</Card.Text>
              </Card.Body>}
              { authordetails.gender &&
              <Card.Body>
                  <Card.Subtitle>
                      Gender:
                  </Card.Subtitle>
                  <Card.Text>{authordetails.gender.replace(/^./, authordetails.gender[0].toUpperCase())}</Card.Text>
              </Card.Body>}
              { authordetails.nationality &&
              <Card.Body>
                  <Card.Subtitle>
                      Nationality:
                  </Card.Subtitle>
                  <Card.Text>{authordetails.nationality}</Card.Text>
              </Card.Body>}
              { authordetails.diversity &&
              <Card.Body>
                  <Card.Subtitle>
                      Diverse Author:
                  </Card.Subtitle>
                  <Card.Text>{authordetails.diversity.replace(/^./, authordetails.diversity[0].toUpperCase())}</Card.Text>
              </Card.Body>}
              <Card.Body>
                  <Card.Subtitle>
                      Complete Works Catalogued:
                  </Card.Subtitle>
                  <Card.Text>{authordetails.complete ? "Yes" : "No"}</Card.Text>
              </Card.Body>
              { authordetails.website &&
              <Card.Body>
                  <Card.Subtitle>
                      Website:
                  </Card.Subtitle>
                  <div><a href={authordetails.website}>{authordetails.website}</a></div>
              </Card.Body>}
              {authorRelationships.length > 0 &&
              <Card.Body>
              <Card.Subtitle>Related Authors:</Card.Subtitle>
              </Card.Body> }
              {authorRelationships.length > 0 && authorRelationships.map((rel) => (
                  <Card.Body>
                  <Card.Subtitle>{rel.relationship}</Card.Subtitle>
                  <div> 
                  <Link to={"/legacy-library/author/" + slugify(rel.reference)}>{deEntitize(rel.first) + " " + deEntitize(rel.last)}</Link>
                  </div>
                  </Card.Body>
              ) )
              }
          </Card>
      </Col>
      <Col md={8} xl={9}>
          <Card>
              <Card.Body>
              <Card.Title>Bio</Card.Title>
              </Card.Body>
              <Card.Body dangerouslySetInnerHTML={{__html: authordetails.bio || "None"}}>
              </Card.Body>
              <Card.Body>
              <Card.Title>Additional Information</Card.Title>
              </Card.Body>
              { !authordetails.additional && !authordetails.additional_information && !authordetails.additional_illustrated &&
              <Card.Body>
                <Card.Text>None</Card.Text>
              </Card.Body>}
              { authordetails.additional &&
              <Card.Body dangerouslySetInnerHTML={{__html: authordetails.additional}}>
              </Card.Body>}
              { authordetails.additional_information &&
              <Card.Body dangerouslySetInnerHTML={{__html: authordetails.additional_information}}>
              </Card.Body>}
              { authordetails.additional_illustrated &&
              <Card.Body dangerouslySetInnerHTML={{__html: authordetails.additional_illustrated}}>
              </Card.Body>}

          </Card>
      </Col>
  </Row>
      </Container>
      </BoxStyled>
      </PageWrapper>
    </>
    )
}

export default AuthorDetails

export const query = graphql`
  query($id: String!) {
    authordetails: mysqlAuthor(id: { eq: $id }) {
      first
      last
      dates
      type
      additional
      gender
      diversity
      nationality
      pronunciation
      complete
      additional_information
      website
      additional_illustrated
      alternate_name
      hidden_alternate
      fixedbirthdate
      reference
      id
      cs_rid
      bio
      authorrelationships {
        author2_id
        relationship
      }
    }
    authorreldetails: allMysqlAuthor {
        edges {
            node {
              reference
              last
              first
              cs_rid
              authorrelationships {
                author2_id
                relationship
              }
            }
        }
    }
  }
`

