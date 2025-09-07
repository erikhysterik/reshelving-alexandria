import * as React from "react"
import { graphql, navigate, useStaticQuery } from "gatsby"
import PageWrapper from "../../../../components/PageWrapper";
import { Container, Row, Col, Breadcrumb, BreadcrumbItem, Table, Card } from "react-bootstrap";
import { Title, Box } from "../../../../components/Core";
import styled from "styled-components";
import { Link } from 'gatsby'
import CustomPagination from "../../../../components/CustomPagination";
import { deEntitize } from "../../../../utils";
import SearchWidget from '../../../../components/SearchWidget'

const _ = require('lodash');
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

function Published(props) {
  const { publicationdatedetails } = props.data

  const [bookList, setBookList] = React.useState([]);
    const [currPage, setCurrPage] = React.useState(1);
  
    React.useEffect(() => {
      afterPageClicked(1);
    }, []);
  
    const afterPageClicked = (page_number) => {
      setCurrPage(page_number);
      
      let endex = Math.min((page_number * 50), publicationdatedetails.publicationdatebooks.length);

       setBookList(publicationdatedetails.publicationdatebooks.slice(((page_number-1)*50), endex));
    };

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
          <BreadcrumbItem linkAs={Link} linkProps={{to: '/legacy-library/books'}} title="Books" active={false} >Books</BreadcrumbItem>
          <BreadcrumbItem linkAs={Link} linkProps={{to: '/legacy-library/books/published'}} title="By Publish Date" active={true} >By Publish Date</BreadcrumbItem>
          </Breadcrumb>
         </Col>
         <Col xs={2}>
         <SearchWidget className="float-end" indices={searchIndices} />
         </Col>
      </Row>
      <Row className="justify-content-center">
              <Col lg="11" className="mb-4 mb-lg-5">
              <Box>
                    <Title variant="hero">{publicationdatedetails.publication_date}</Title>
                  </Box>
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
                    <CustomPagination
      totPages={publicationdatedetails.publicationdatebooks.length % 50 ? publicationdatedetails.publicationdatebooks.length / 50 + 1 : publicationdatedetails.publicationdatebooks.length / 50 }
      currentPage={currPage}
      pageClicked={(ele) => {
        afterPageClicked(ele);
      }}
    >
                    <Table striped bordered hover size="sm" variant="dark">
          <thead>
              <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Publish Date</th>
              </tr>
          </thead>
          <tbody>
        {bookList.map((item, ind) => {
          return <tr style={{cursor: "pointer"}} key={item.title + ind} onClick={() => navigate('/legacy-library/book/' + slugify(item.reference))} >
              <td>{deEntitize(item.title)}</td>
              <td>{deEntitize(item.first ?? "") + " " + deEntitize(item.last ?? "")}</td>
              <td>{item.publication_date}</td>
              </tr>;
        })}
        </tbody>
      </Table>
      </CustomPagination>
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

export default Published

export const query = graphql`
query ($id: String!) {
  publicationdatedetails: mysqlPublicationdates(id: { eq: $id }) {
    publication_date
    publicationdatebooks {
      title
      reference
      first
      last
      publication_date
    }
  }
}
`

