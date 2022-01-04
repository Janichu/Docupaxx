/**
 * Footer
 *
 * General Footer for Docupaxx
 * Links to Pages relating to Website Creators and Admins
 */
import { Link } from "react-router-dom";
import { Container, Grid, Header, List, Segment } from "semantic-ui-react";

/**
 * DocupaxxFooter
 */
export const DocupaxxFooter = () => {
  return (
    <DocupaxxFooterSegment>
      <DocupaxxFooterAboutColumn />
      <DocupaxxFooterContactUsColumn />
    </DocupaxxFooterSegment>
  );
};

/**
 * DocupaxxFooterGrid
 */
const DocupaxxFooterSegment = ({ children }) => {
  return (
    <Segment
      inverted
      vertical
      style={{ padding: "5em 0em", minHeight: "15vh" }}
    >
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>{children}</Grid.Row>
        </Grid>
      </Container>
    </Segment>
  );
};

/**
 * DocupaxxFooterAboutColumn
 */
const DocupaxxFooterAboutColumn = () => {
  return (
    <DocupaxxFooterGridColumn headerContent="About">
      <List.Item as={Link} to="/aboutUs">
        About Us
      </List.Item>
      <List.Item as={Link} to="/aboutDocupaxx">
        Learn about Docupaxx
      </List.Item>
      <List.Item as={Link} to="/testimonials">
        Testimonials
      </List.Item>
      <List.Item as={Link} to="/features">
        Features
      </List.Item>
    </DocupaxxFooterGridColumn>
  );
};

/**
 * DocupaxxFooterContactUsColumn
 */
const DocupaxxFooterContactUsColumn = () => {
  return (
    <DocupaxxFooterGridColumn headerContent="Contact Us">
      <List.Item as={Link} to="/faq">
        FAQ
      </List.Item>
      <List.Item as={Link} to="/contactUs">
        Send us Your Concern
      </List.Item>
    </DocupaxxFooterGridColumn>
  );
};

/**
 * DocupaxxFooterGridColumn
 */
const DocupaxxFooterGridColumn = ({ headerContent, children }) => {
  return (
    <Grid.Column width={3}>
      <Header inverted as="h4" content={headerContent} />
      <List link inverted>
        {children}
      </List>
    </Grid.Column>
  );
};
