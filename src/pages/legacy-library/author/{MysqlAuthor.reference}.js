import * as React from "react"
import { graphql, navigate } from "gatsby"
import PageWrapper from "../../../components/PageWrapper";
import { Container, Row, Col, Breadcrumb, BreadcrumbItem, Card, Table } from "react-bootstrap";
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
  const { authordetails } = props.data
  
  const authorRelationships = authordetails.authorrelationships.map((x) => {
    // take the relationship name from the secondary source, and if not there use author's relationship
    // entry and add " of" ... so find "Husband" from other person's info, or specify "Wife of"
    let rel = x.b_relationship ? 
      x.b_relationship.trim().replace(/^./, x.b_relationship[0].toUpperCase()) : 
        x.a_relationship ? 
          x.a_relationship.trim().replace(/^./, x.a_relationship[0].toUpperCase()) + " of" : "";

    return {
        // capitalize the Relationship entry
        relationship: rel,
        first: x.first,
        last: x.last,
        reference: x.reference
    }
  })

  // combine entries as "Author & Illustrator" for role if applicable, else build the combined array
  let authorBooks = [], illustratorBooks = JSON.parse(JSON.stringify(authordetails.illustratorbooks));
  for (let i = 0; i < authordetails.authorbooks.length; i++) {
    let andIllustrator = false;
    // if same book is in author and illustrator, display as one but change role
    let a = illustratorBooks.findIndex(el => el.book_id === authordetails.authorbooks[i].book_id) 
    if (a !== -1) {
       andIllustrator = true;
       illustratorBooks.splice(a, 1);
    }
    authorBooks.push({
        reference: authordetails.authorbooks[i].reference,
        title: authordetails.authorbooks[i].title,
        publication_date: authordetails.authorbooks[i].publication_date,
        role: andIllustrator ? "Author & Illustrator" : "Author"
    })
  }
  for (let j = 0; j < illustratorBooks.length; j++) {
    authorBooks.push({
        reference: illustratorBooks[j].reference,
        title: illustratorBooks[j].title,
        publication_date: illustratorBooks[j].publication_date,
        role: "Illustrator"
    })
  }

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
              { authorRelationships.length > 0 &&
              <Card.Body>
              <Card.Subtitle>Related Authors:</Card.Subtitle> 
              {authorRelationships.length > 0 && authorRelationships.map((rel) => (
                  <>
                  <Card.Text style={{marginBottom: 0}}>{rel.relationship}</Card.Text>
                  <div> 
                  <Link to={"/legacy-library/author/" + slugify(rel.reference)}>{deEntitize(rel.first) + " " + deEntitize(rel.last)}</Link>
                  </div>
                  </>
              ) )
              }
              </Card.Body> }
              { authordetails.authorpseudonyms?.length > 0 &&
              <Card.Body>
              <Card.Subtitle>Pseudonym{authordetails.authorpseudonyms.length > 1 && "s"}:</Card.Subtitle> 
              {authordetails.authorpseudonyms?.length > 0 && authordetails.authorpseudonyms.map((pse) => (
                  <div> 
                  <Link to={"/legacy-library/author/" + slugify(pse.reference)}>{deEntitize(pse.first) + " " + deEntitize(pse.last)}</Link>
                  </div>
              ) )
              }
              </Card.Body> }
              { authordetails.authorpseudonymofs?.length > 0 &&
              <Card.Body>
              <Card.Subtitle>Pseudonym Of:</Card.Subtitle> 
              {authordetails.authorpseudonymofs?.length > 0 && authordetails.authorpseudonymofs.map((pse) => (
                  <div> 
                  <Link to={"/legacy-library/author/" + slugify(pse.reference)}>{deEntitize(pse.first) + " " + deEntitize(pse.last)}</Link>
                  </div>
              ) )
              }
              </Card.Body> }
              
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
  <Row className="justify-content-center">
              <Col lg="12" className="mb-4 mb-lg-5">
                <Card>
                    <Card.Title>Books</Card.Title>
                    <Table striped bordered hover size="sm" variant="dark">
          <thead>
              <tr>
                  <th>Title</th>
                  <th>Role</th>
                  <th>Published</th>
              </tr>
          </thead>
          <tbody>
        {authorBooks.map((item, ind) => {
          return <tr style={{cursor: "pointer"}} key={item.title + ind} onClick={() => navigate('/legacy-library/book/' + slugify(item.reference))} >
              <td>{deEntitize(item.title)}</td>
              <td>{item.role}</td>
              <td>{item.publication_date}</td>
              </tr>;
        })}
        </tbody>
      </Table>
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
        a_relationship
        b_relationship
        first
        last
        reference
      }
      authorpseudonyms {
        first
        last
        reference
      }
      authorpseudonymofs {
        first
        last
        reference
      }
      authorbooks {
        reference
        publication_date
        title
        book_id
      }
      illustratorbooks {
        reference
        publication_date
        title
        book_id
      }
    }
  }
`

