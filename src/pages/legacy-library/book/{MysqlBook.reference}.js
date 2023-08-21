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

function BookTags(props) {
    return (
        <>
            <Card.Body>
            <Card.Subtitle>Tags</Card.Subtitle>
              <div className="h5">
              { props.children && 
              <Accordion defaultActiveKey={[0]} alwaysOpen>
               { props.children }
              </Accordion>
              }
              { !props.children && "N/A" }
              </div>
            </Card.Body>
        </>
    );
}

function TagSection(props) {
    return (
        <>
            <Accordion.Item eventKey={props.tagkey}>
                <Accordion.Header>{props.header}</Accordion.Header>
                <Accordion.Body>
                    { props.tags?.split(',').filter(Boolean).map((v, i) => <><Badge key={i} bg='info' text="light"><Link to={"/legacy-library/tag/" + slugify(v.trim(), {lower: true})}>{v.trim()}</Link></Badge><span> </span></>) ?? ""}
                </Accordion.Body>
            </Accordion.Item>
        </>
    );
}

function ContentConsideration(props) {
    const { tagkey, cc, header } = props;
    return (
        <>
           <Accordion.Item eventKey={tagkey}>
            <Accordion.Header>{header}</Accordion.Header>
            <Accordion.Body dangerouslySetInnerHTML={{__html: cc}}>
            </Accordion.Body>
           </Accordion.Item>
        </>
    )
}

function SendToNotionButton(props) {
    const [isLoading, setLoading] = React.useState(false);

    let body = JSON.stringify(
        {
            title: props.title,
            pubdate: props.publication_date,
            pagecount: props.pages,
            description: props.description,
            contentconsiderations: props.ccs,
            tags: props.tags
        }
    )
    
    const options = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: body
      };

  React.useEffect(() => {
    if (isLoading) {
      fetch(`${process.env.GATSBY_LAMBDA_SAVE_URL}`, options).then(() => {
        setLoading(false);
      });
    }
  }, [isLoading]);

  const handleClick = () => setLoading(true);

  return (
    <Button
      variant="primary"
      disabled={isLoading}
      onClick={!isLoading ? handleClick : null}
    >
      {isLoading ? 'Saving...' : 'Send To Notion'}
    </Button>
  );
}

function BookDetails(props) {
  const { mysqlBook } = props.data
  
  const tagSections = [
      { tags: mysqlBook.subject, section: "Subjects" },
      { tags: mysqlBook.tags, section: "General" },
      { tags: mysqlBook.secondary_tags, section: "Secondary" },
      { tags: mysqlBook.illustration_tags, section: "Illustration" },
      { tags: mysqlBook.location, section: "Location" },
      { tags: mysqlBook.tale_name, section: "Tale Name" },
      { tags: [mysqlBook.lead_name,mysqlBook.lead_gender,mysqlBook.lead_race_ethnicity_nationality,mysqlBook.lead_age,mysqlBook.lead_religion,mysqlBook.lead_character,mysqlBook.lead_physical,mysqlBook.lead_vocation].filter(Boolean).join(","), section: "Lead Character"}
  ].filter((x) => x.tags)
  .map((v, i) => <><TagSection tagkey={i} tags={v.tags} header={v.section} /></>);

  const ccTypes = [
      { cc: mysqlBook.disclaimers, header: "General"},
      { cc: (mysqlBook.cc_behavior ?? "") + (mysqlBook.new_cc_behavior ?? ""), header: "Behavior"},
      { cc: (mysqlBook.cc_discrimination ?? "") + (mysqlBook.new_cc_discrimination ?? ""), header: "Discrimination"},
      { cc: (mysqlBook.cc_health ?? "") + (mysqlBook.new_cc_health ?? ""), header: "Emotional Health"},
      { cc: (mysqlBook.cc_language ?? "") + (mysqlBook.new_cc_language ?? ""), header: "Language"},
      { cc: (mysqlBook.cc_magic ?? "") + (mysqlBook.new_cc_magic ?? ""), header: "Magic"},
      { cc: (mysqlBook.cc_religion ?? "") + (mysqlBook.new_cc_religion ?? ""), header: "Religion"},
      { cc: (mysqlBook.cc_science ?? "") + (mysqlBook.new_cc_science ?? ""), header: "Science"},
      { cc: (mysqlBook.cc_sexuality ?? "") + (mysqlBook.new_cc_sexuality ?? ""), header: "Sexuality"},
      { cc: (mysqlBook.cc_violence_weapons ?? "") + (mysqlBook.new_cc_violence_weapons ?? ""), header: "Violence"}
  ].filter((x) => x.cc);
  const ccSections = ccTypes.map((v, i) => <><ContentConsideration tagkey={i} cc={v.cc} header={v.header} /></>)

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
          <BreadcrumbItem linkAs={Link} linkProps={{to: '/legacy-library/book/' + mysqlBook.reference}} title={deEntitize(mysqlBook.title)} active={true} >{deEntitize(mysqlBook.title)}</BreadcrumbItem>
          </Breadcrumb>
         </Col>
         <Col xs={2}>
         <SearchWidget className="float-end" indices={searchIndices} />
         </Col>
      </Row>
      <Row className="justify-content-center">
              <Col lg="11" className="mb-4 mb-lg-5">
              <Box>
                    <Title variant="hero">{deEntitize(mysqlBook.title)}</Title>
                    <SendToNotionButton 
                    title={deEntitize(mysqlBook.title)} 
                    publication_date={mysqlBook.publication_date}
                    pages={mysqlBook.pages}
                    description={deEntitize(mysqlBook.description).replace( /(<([^>]+)>)/ig, '').trim().replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&apos;/g, '\'').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')}
                    ccs={ccTypes.length ? ccTypes.map(x => x.cc).reduce((prev, cur) => prev + '\n' + deEntitize(cur)).replace( /(<([^>]+)>)/ig, '').trim().replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&apos;/g, '\'').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"') : ""}
                    tags={mysqlBook.subject ? mysqlBook.subject.split(',').filter(Boolean).map(x => x.trim().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())) : []}
                    />
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
                      Author{ mysqlBook.bookauthors?.length > 1 && "s" }:
                  </Card.Subtitle>
                  { mysqlBook.bookauthors?.map((a) => (
                     <div> 
                     <Link to={"/legacy-library/author/" + slugify(a.reference)}>{deEntitize(a.first) + " " + deEntitize(a.last)}</Link>
                     </div>
                  ))
                  }
              </Card.Body>
              <Card.Body>
                  <Card.Subtitle>
                      Illustrator{ mysqlBook.bookillustrators?.length > 1 && "s" }:
                  </Card.Subtitle>
                  { mysqlBook.bookillustrators?.map((a) => (
                     <div> 
                     <Link to={"/legacy-library/author/" + slugify(a.reference)}>{deEntitize(a.first) + " " + deEntitize(a.last)}</Link>
                     </div>
                  ))
                  }
              </Card.Body>
              <Card.Body>
                  <Card.Subtitle>
                      Publisher:
                  </Card.Subtitle>
                  <Card.Text>{mysqlBook.publisher_name}</Card.Text>
                  <Card.Subtitle>
                      Date:
                  </Card.Subtitle>
                  <Card.Text>{mysqlBook.publication_date}</Card.Text>
                  <Card.Subtitle>
                      Pages:
                  </Card.Subtitle>
                  <Card.Text>{mysqlBook.pages}</Card.Text>
                  { mysqlBook.series_name &&
                  <>
                    <Card.Subtitle>
                      Series:
                  </Card.Subtitle>
                  <div> 
                     <Link to={"/legacy-library/series/" + slugify(mysqlBook.series_reference)}>{deEntitize(mysqlBook.series_name)}</Link>
                  </div>
                  </>}
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
              { ccSections.length > 0 &&
              <Accordion>
                  {ccSections}
              </Accordion>
              }
              { ccSections.length === 0 && <div className="h6">Not Provided</div>}
              </Card.Body>
              <BookTags>{tagSections}</BookTags>
              <Card.Body>
            <Card.Subtitle>Time Periods</Card.Subtitle>
              <div className="h5">
              <Accordion defaultActiveKey={[0]} alwaysOpen>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Major</Accordion.Header>
                <Accordion.Body>
                    { mysqlBook.bookmajortimeperiods?.filter(Boolean).map((v, i) => <><Badge key={i} bg='info' text="light"><Link to={"/legacy-library/books/timeperiod/major/" + slugify(v.reference, {lower: true})}>{v.name.trim()}</Link></Badge><span> </span></>) ?? ""}
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
                <Accordion.Header>Minor</Accordion.Header>
                <Accordion.Body>
                    { mysqlBook.bookminortimeperiods?.filter(Boolean).map((v, i) => <><Badge key={i} bg='info' text="light"><Link to={"/legacy-library/books/timeperiod/" + slugify(v.region, {lower: true}) + "/" + slugify(v.reference, {lower: true})}>{v.name}</Link></Badge><span> </span></>) ?? ""}
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
                <Accordion.Header>Centuries</Accordion.Header>
                <Accordion.Body>
                    { mysqlBook.bookcenturies?.filter(Boolean).map((v, i) => <><Badge key={i} bg='info' text="light"><Link to={"/legacy-library/books/century/" + slugify(v.reference, {lower: true})}>{v.name}</Link></Badge><span> </span></>) ?? ""}
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
                <Accordion.Header>Decades</Accordion.Header>
                <Accordion.Body>
                    { mysqlBook.bookdecades?.filter(Boolean).map((v, i) => <><Badge key={i} bg='info' text="light"><Link to={"/legacy-library/books/decade/" + slugify(v.reference, {lower: true})}>{v.decade}</Link></Badge><span> </span></>) ?? ""}
                </Accordion.Body>
            </Accordion.Item>
              </Accordion>
              
              </div>
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
      cc_behavior
      cc_discrimination
      cc_health
      cc_language
      cc_magic
      cc_religion
      cc_science
      cc_sexuality
      cc_violence_weapons
      online_link
      tags
      publication_date
      disclaimers
      secondary_tags
      illustration_tags
      subject
      lead_name
      lead_gender
      lead_race_ethnicity_nationality
      lead_age
      lead_religion
      lead_character
      lead_physical
      lead_vocation
      location
      tale_name
      new_cc_behavior
      new_cc_discrimination
      new_cc_health
      new_cc_language
      new_cc_magic
      new_cc_religion
      new_cc_science
      new_cc_sexuality
      new_cc_themes
      new_cc_violence_weapons
      new_cc_witchcraft
      pages
      bookauthors {
        first
        last
        reference
      }
      bookillustrators {
        first
        last
        reference
      }
      series_name
      series_reference
      publisher_name
      bookcenturies {
        name
        reference
      }
      bookdecades {
        decade
        reference
      }
      bookmajortimeperiods {
        name
        reference
      }
      bookminortimeperiods {
        name
        reference
        region
      }
    }
  }
`

