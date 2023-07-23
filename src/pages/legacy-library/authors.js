import * as React from "react"
import { graphql, navigate } from "gatsby"
import PageWrapper from "../../components/PageWrapper";
import { Container, Row, Col, Breadcrumb, BreadcrumbItem, Table } from "react-bootstrap";
import { Title, Box } from "../../components/Core";
import styled from "styled-components";
import { Link } from 'gatsby'
import CustomPagination from "../../components/CustomPagination";
import { deEntitize } from "../../utils";
import SearchWidget from '../../components/SearchWidget'

const slugify = require('@sindresorhus/slugify')

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

function Authors(props) {
    const [tagList, setTagList] = React.useState([]);
    const [currPage, setCurrPage] = React.useState(1);
  
    React.useEffect(() => {
      afterPageClicked(1);
    }, []);
  
    const afterPageClicked = (page_number) => {
      setCurrPage(page_number);
      
      let endex = Math.min((page_number * 50), allMysqlAuthor.edges.length);

       setTagList(allMysqlAuthor.edges.slice(((page_number-1)*50), endex));
    };

    const { allMysqlAuthor } = props.data

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
          <BreadcrumbItem linkAs={Link} linkProps={{to: '/legacy-library/authors'}} title="Authors" active={true} >Authors</BreadcrumbItem>
          </Breadcrumb>
         </Col>
         <Col xs={2}>
         <SearchWidget className="float-end" indices={searchIndices} />
         </Col>
      </Row>
      <Row className="justify-content-center">
              <Col lg="11" className="mb-4 mb-lg-5">
              <Box>
                    <Title variant="hero">All Authors</Title>
                  </Box>
              </Col>
            </Row>
            <Row>
                <Col>
    <CustomPagination
      totPages={allMysqlAuthor.edges.length % 50 ? allMysqlAuthor.edges.length / 50 + 1 : allMysqlAuthor.edges.length / 50 }
      currentPage={currPage}
      pageClicked={(ele) => {
        afterPageClicked(ele);
      }}
    >
      <Table striped bordered hover size="sm" variant="dark">
          <thead>
              <tr>
                  <th>Name</th>
                  <th>{""}</th>
                  <th>{""}</th>
              </tr>
          </thead>
          <tbody>
        {tagList.map((item, ind) => {
          return <tr style={{cursor: "pointer"}} key={item.node.id + ind} onClick={() => navigate('/legacy-library/author/' + slugify(item.node.reference))} >
              <td>{deEntitize(item.node.first).trim() + " " + deEntitize(item.node.last).trim()}</td>
              <td>{item.node.dates}</td>
              <td>{item.node.type}</td>
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

export default Authors

export const query = graphql`
  query {
    allMysqlAuthor {
        edges {
            node {
                id
                first
                last
                reference
                dates
                type
            }
        }
    }
  }
`
