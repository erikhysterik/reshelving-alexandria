import * as React from "react"
import { graphql, navigate } from "gatsby"
import PageWrapper from "../components/PageWrapper";
import { Container, Row, Col, Breadcrumb, BreadcrumbItem, Table } from "react-bootstrap";
import { Title, Box, A } from "../components/Core";
import styled from "styled-components";
import { Link } from 'gatsby'
import CustomPagination from "../components/CustomPagination";

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

function Database(props) {
    const [tagList, setTagList] = React.useState([]);
    const [currPage, setCurrPage] = React.useState(1);
  
    React.useEffect(() => {
      afterPageClicked(1);
    }, []);
  
    const afterPageClicked = (page_number) => {
      setCurrPage(page_number);
      
      let endex = Math.min((page_number * 50), allMysqlBook.edges.length);

       setTagList(allMysqlBook.edges.slice(((page_number-1)*50), endex));
    };

    const { allMysqlBook } = props.data

  return (
    <>
      <PageWrapper footerDark>
          <BoxStyled>
          <div className="pt-5 mt-5"></div>
      <Container>
      <Row>
          <Breadcrumb>
          <BreadcrumbItem linkAs={Link} linkProps={{to: '/database'}} title="Database Home" active={true} >Database Home</BreadcrumbItem>
          <BreadcrumbItem linkAs={Link} linkProps={{to: '/books'}} title="Books" active={false} >Books</BreadcrumbItem>
         </Breadcrumb>
      </Row>
      <Row className="justify-content-center">
              <Col lg="11" className="mb-4 mb-lg-5">
              <Box pt={["40px", null, null, "75px"]}>
              <Box>
                    <Title variant="hero">Database</Title>
                  </Box>
                  </Box>
              </Col>
            </Row>
            <Row>
                <Col>
    <CustomPagination
      totPages={allMysqlBook.edges.length % 50 ? allMysqlBook.edges.length / 50 + 1 : allMysqlBook.edges.length / 50 }
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
                  <th>Published</th>
              </tr>
          </thead>
          <tbody>
        {tagList.map((item, ind) => {
          return <tr key={item.node.id + ind} onClick={() => navigate('/book/' + item.node.reference)} >
              <td>{item.node.title}</td>
              <td>Coming Soon</td>
              <td>{item.node.publication_date}</td>
              </tr>;
        })}
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

export default Database

export const query = graphql`
  query {
    allMysqlBook {
        edges {
            node {
                id
                title
                publication_date
                reference
            }
        }
    }
  }
`
