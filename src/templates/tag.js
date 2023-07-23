import * as React from "react"
import { graphql, navigate } from "gatsby"
import PageWrapper from "../components/PageWrapper";
import { Container, Row, Col, Breadcrumb, BreadcrumbItem, Table } from "react-bootstrap";
import { Title, Box } from "../components/Core";
import styled from "styled-components";
import { Link } from 'gatsby'
import CustomPagination from "../components/CustomPagination";
import { deEntitize } from "../utils";
import SearchWidget from '../components/SearchWidget'

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

    const { bookTags, 
      bookSubject, 
      bookIllTags, 
      bookSecTags,
      bookLocTags,
      bookLeadNameTags,
      bookLeadGenderTags,
      bookLeadRaceTags,
      bookLeadAgeTags,
      bookLeadReligionTags,
      bookLeadCharacterTags,
      bookLeadPhysicalTags,
      bookLeadVocationTags,
      bookTaleNameTags
    } = props.data
    let mergedBooks = []
    mergedBooks = 
    _.chain(mergedBooks)    
    .unionWith(bookTags?.edges ?? [], 
      bookSubject?.edges ?? [], 
      bookIllTags?.edges ?? [], 
      bookSecTags?.edges ?? [], 
      bookLocTags?.edges ?? [], 
      bookLeadNameTags?.edges ?? [], 
      bookLeadGenderTags?.edges ?? [], 
      bookLeadRaceTags?.edges ?? [],
      bookLeadAgeTags?.edges ?? [],
      bookLeadReligionTags?.edges ?? [],
      bookLeadCharacterTags?.edges ?? [],
      bookLeadPhysicalTags?.edges ?? [],
      bookLeadVocationTags?.edges ?? [],
      bookTaleNameTags?.edges ?? [],
      _.isEqual)
    .sortBy([(b) => b.node.sort_title])
    .value()    

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
          <BreadcrumbItem linkAs={Link} linkProps={{to: '/legacy-library/tag'}} title="By Tag" active={true} >By Tag</BreadcrumbItem>
          </Breadcrumb>
         </Col>
         <Col xs={2}>
         <SearchWidget className="float-end" indices={searchIndices} />
         </Col>
      </Row>
      <Row className="justify-content-center">
              <Col lg="11" className="mb-4 mb-lg-5">
              <Box>
                    <Title variant="hero">Tag: {props.pageContext.tag}</Title>
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
          return <tr style={{cursor: "pointer"}} key={item.node.id + ind} onClick={() => navigate('/legacy-library/book/' + slugify(item.node.reference))} >
              <td>{deEntitize(item.node.title)}</td>
              <td>{deEntitize(item.node.bookauthors.at(0)?.first ?? "") + " " + deEntitize(item.node.bookauthors.at(0)?.last ?? "")}</td>
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
query MyTagQuery ($regextag: String!) {
    bookTags: allMysqlBook(filter: {tags: {regex: $regextag}}) {
       edges {
         node {
            cs_rid
            id
            title
            reference
            bookauthors {
              first
              last
            }
        }
      }
    }
    bookSubject: allMysqlBook(filter: {subject: {regex: $regextag}}) {
        edges {
          node {
             cs_rid
             id
             title
             reference
             bookauthors {
              first
              last
            }
         }
       }
    }
    bookIllTags: allMysqlBook(filter: {illustration_tags: {regex: $regextag}}) {
        edges {
          node {
             cs_rid
             id
             title
             reference
             bookauthors {
              first
              last
            }
         }
       }
    }
    bookSecTags: allMysqlBook(filter: {secondary_tags: {regex: $regextag}}) {
        edges {
          node {
             cs_rid
             id
             title
             reference
             bookauthors {
              first
              last
            }
         }
       }
    }
    bookLocTags: allMysqlBook(filter: {location: {regex: $regextag}}) {
      edges {
        node {
           cs_rid
           id
           title
           reference
           bookauthors {
            first
            last
          }
       }
     }
    }
    bookLeadNameTags: allMysqlBook(filter: {lead_name: {regex: $regextag}}) {
      edges {
        node {
           cs_rid
           id
           title
           reference
           bookauthors {
            first
            last
          }
       }
     }
    }
    bookLeadGenderTags: allMysqlBook(filter: {lead_gender: {regex: $regextag}}) {
      edges {
        node {
           cs_rid
           id
           title
           reference
           bookauthors {
            first
            last
          }
       }
     }
    }
    bookLeadRaceTags: allMysqlBook(filter: {lead_race_ethnicity_nationality: {regex: $regextag}}) {
      edges {
        node {
           cs_rid
           id
           title
           reference
           bookauthors {
            first
            last
          }
       }
     }
    }
    bookLeadAgeTags: allMysqlBook(filter: {lead_age: {regex: $regextag}}) {
      edges {
        node {
           cs_rid
           id
           title
           reference
           bookauthors {
            first
            last
          }
       }
     }
    }
    bookLeadReligionTags: allMysqlBook(filter: {lead_religion: {regex: $regextag}}) {
      edges {
        node {
           cs_rid
           id
           title
           reference
           bookauthors {
            first
            last
          }
       }
     }
    }
    bookLeadCharacterTags: allMysqlBook(filter: {lead_character: {regex: $regextag}}) {
      edges {
        node {
           cs_rid
           id
           title
           reference
           bookauthors {
            first
            last
          }
       }
     }
    }
    bookLeadPhysicalTags: allMysqlBook(filter: {lead_physical: {regex: $regextag}}) {
      edges {
        node {
           cs_rid
           id
           title
           reference
           bookauthors {
            first
            last
          }
       }
     }
    }
    bookLeadVocationTags: allMysqlBook(filter: {lead_vocation: {regex: $regextag}}) {
      edges {
        node {
           cs_rid
           id
           title
           reference
           bookauthors {
            first
            last
          }
       }
     }
    }
    bookTaleNameTags: allMysqlBook(filter: {tale_name: {regex: $regextag}}) {
      edges {
        node {
           cs_rid
           id
           title
           reference
           bookauthors {
            first
            last
          }
       }
     }
    }
  }
`

