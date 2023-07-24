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

function SeriesDetails(props) {
  const { seriesdetails } = props.data
  
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
          <BreadcrumbItem linkAs={Link} linkProps={{to: '/legacy-library/series'}} title="Series" active={false} >Series</BreadcrumbItem>
          <BreadcrumbItem linkAs={Link} linkProps={{to: '/legacy-library/series/' + slugify(seriesdetails.reference)}} title={deEntitize(seriesdetails.name)} active={true} >{deEntitize(seriesdetails.name)}</BreadcrumbItem>
          </Breadcrumb>
         </Col>
         <Col xs={2}>
         <SearchWidget className="float-end" indices={searchIndices} />
         </Col>
      </Row>
      <Row className="justify-content-center">
              <Col lg="11" className="mb-4 mb-lg-5">
              <Box>
                    <Title variant="hero">{deEntitize(seriesdetails.name)}</Title>
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
              { /* authordetails.type &&
              <Card.Body>
                  <Card.Subtitle>
                      Type:
                  </Card.Subtitle>
                  <Card.Text>{authordetails.type.replace(/^./, authordetails.type[0].toUpperCase())}</Card.Text>
  </Card.Body> */}
              { /*authordetails.pronunciation &&
              <Card.Body>
                  <Card.Subtitle>
                      Pronunciation:
                  </Card.Subtitle>
                  <Card.Text>{authordetails.pronunciation}</Card.Text>
</Card.Body> */}
              { /* altNames.length > 0 &&
              <Card.Body>
                  <Card.Subtitle>
                      Alternate Name{ altNames.length > 1 && "s"}:
                  </Card.Subtitle>
                  <Card.Text>
                  { altNames.length > 0 && altNames.map((x) => (
                  <div>{x}</div>))}
                  </Card.Text> 
                  </Card.Body> */}
              { /* authordetails.fixedbirthdate !== '0000-00-00' && authordetails.fixedbirthdate &&
              <Card.Body>
                  <Card.Subtitle>
                      Birth Date:
                  </Card.Subtitle>
                  <Card.Text>{new Date(authordetails.fixedbirthdate).toLocaleDateString('en-US', {month: 'long', day: 'numeric'})}</Card.Text>
                </Card.Body> */}
              { /* authordetails.gender &&
              <Card.Body>
                  <Card.Subtitle>
                      Gender:
                  </Card.Subtitle>
                  <Card.Text>{authordetails.gender.replace(/^./, authordetails.gender[0].toUpperCase())}</Card.Text>
              </Card.Body> */}
              { /* authordetails.nationality &&
              <Card.Body>
                  <Card.Subtitle>
                      Nationality:
                  </Card.Subtitle>
                  <Card.Text>{authordetails.nationality}</Card.Text>
            </Card.Body> */}
              { /* authordetails.diversity &&
              <Card.Body>
                  <Card.Subtitle>
                      Diverse Author:
                  </Card.Subtitle>
                  <Card.Text>{authordetails.diversity.replace(/^./, authordetails.diversity[0].toUpperCase())}</Card.Text>
          </Card.Body> */}
             { /* <Card.Body>
                  <Card.Subtitle>
                      Complete Works Catalogued:
                  </Card.Subtitle>
                  <Card.Text>{authordetails.complete ? "Yes" : "No"}</Card.Text>
        </Card.Body> */ }
              { /* authordetails.website &&
              <Card.Body>
                  <Card.Subtitle>
                      Website:
                  </Card.Subtitle>
                  <div><a href={authordetails.website}>{authordetails.website}</a></div>
        </Card.Body> */}
              
              
              
              
          </Card>
      </Col>
      <Col md={8} xl={9}>
          <Card>
              <Card.Body>
              <Card.Title>Description</Card.Title>
              </Card.Body>
              <Card.Body dangerouslySetInnerHTML={{__html: seriesdetails.description || "None"}}>
              </Card.Body>
          </Card>
      </Col>
  </Row>
  </Container>
  <Container style={{paddingTop: 24}}>
  <Row className="justify-content-center">
              <Col lg="12" className="mb-4 mb-lg-5">
                <Card>
                  <Card.Body>
                    <Card.Title>Books</Card.Title>
                    </Card.Body>
                    <Card.Body>
                    <Table striped bordered hover size="sm" variant="dark">
          <thead>
              <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Publish Date</th>
              </tr>
          </thead>
          <tbody>
        {seriesdetails.seriesbooks.map((item, ind) => {
          return <tr style={{cursor: "pointer"}} key={item.title + ind} onClick={() => navigate('/legacy-library/book/' + slugify(item.reference))} >
              <td>{deEntitize(item.title)}</td>
              <td>{deEntitize(item.first ?? "") + " " + deEntitize(item.last ?? "")}</td>
              <td>{item.publication_date}</td>
              </tr>;
        })}
        </tbody>
      </Table>
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

export default SeriesDetails

export const query = graphql`
  query($id: String!) {
    seriesdetails: mysqlSeries(id: { eq: $id }) {
      cs_rid
      name
      description
      reference
      status
      publisher
      pages
      size
      reading_level
      series_type
      incomplete
      alternate_name
      workflow
      publisher_name
      seriesbooks {
        reference
        publication_date
        title
        first
        last
      }
    }
  }
`

