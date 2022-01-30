import * as React from "react"
import { graphql } from "gatsby"
import PageWrapper from "../../components/PageWrapper";
import { Container, Row, Col } from "react-bootstrap";
import { Title, Box } from "../../components/Core";
import styled from "styled-components";

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
      <Row className="justify-content-center">
              <Col lg="11" className="mb-4 mb-lg-5">
              <Box pt={["40px", null, null, "75px"]}>
              <Box>
                    <Title variant="hero">{mysqlBook.title}</Title>
                  </Box>
                  </Box>
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
    }
  }
`

