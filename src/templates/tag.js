import * as React from "react"
import { graphql, navigate } from "gatsby"
import PageWrapper from "../components/PageWrapper";
import { Container, Row, Col, Breadcrumb, BreadcrumbItem, Table } from "react-bootstrap";
import { Title, Box, A } from "../components/Core";
import styled from "styled-components";
import { Link } from 'gatsby'
import CustomPagination from "../components/CustomPagination";
import { deEntitize } from "../utils";
const _ = require('lodash');

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

function Tag(props) {
    const [tagList, setTagList] = React.useState([]);
    const [currPage, setCurrPage] = React.useState(1);
  
    React.useEffect(() => {
      afterPageClicked(1);
    }, []);
  
    const afterPageClicked = (page_number) => {
      setCurrPage(page_number);
      
      let endex = Math.min((page_number * 50), mergedBooks.length);

       setTagList(mergedBooks.slice(((page_number-1)*50), endex));
    };

    const { bookTags, bookSubject, bookIllTags, bookSecTags } = props.data
    let mergedBooks = []
    mergedBooks = 
    _.chain(mergedBooks)    
    .unionWith(bookTags?.edges, bookSubject?.edges, bookIllTags?.edges, bookSecTags?.edges, _.isEqual)
    .sortBy([(b) => b.node.title])
    .value()

    console.log(mergedBooks)
    

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
          <BreadcrumbItem linkAs={Link} linkProps={{to: '/tag'}} title="Books By Tag" active={false} >Books By Tag</BreadcrumbItem>
          </Breadcrumb>
      </Row>
      <Row className="justify-content-center">
              <Col lg="11" className="mb-4 mb-lg-5">
              <Box pt={["40px", null, null, "75px"]}>
              <Box>
                    <Title variant="hero">Books by tag: {props.pageContext.tag}</Title>
                  </Box>
                  </Box>
              </Col>
            </Row>
            <Row>
                <Col>
    <CustomPagination
      totPages={mergedBooks.length % 50 ? mergedBooks.length / 50 + 1 : mergedBooks.length / 50 }
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
              </tr>
          </thead>
          <tbody>
        {tagList.map((item, ind) => {
          return <tr style={{cursor: "pointer"}} key={item.node.id + ind} onClick={() => navigate('/book/' + item.node.reference)} >
              <td>{deEntitize(item.node.title)}</td>
              <td>Coming Soon</td>
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

export default Tag

export const query = graphql`
query MyTagQuery ($globtag: String!) {
    bookTags: allMysqlBook(filter: {tags: {glob: $globtag}}) {
       edges {
         node {
            cs_rid
            id
            title
            reference
        }
      }
    }
    bookSubject: allMysqlBook(filter: {subject: {glob: $globtag}}) {
        edges {
          node {
             cs_rid
             id
             title
             reference
         }
       }
    }
    bookIllTags: allMysqlBook(filter: {illustration_tags: {glob: $globtag}}) {
        edges {
          node {
             cs_rid
             id
             title
             reference
         }
       }
    }
    bookSecTags: allMysqlBook(filter: {secondary_tags: {glob: $globtag}}) {
        edges {
          node {
             cs_rid
             id
             title
             reference
         }
       }
    }
  }
`

