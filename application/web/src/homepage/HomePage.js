import { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Header, Icon, Segment } from "semantic-ui-react";
import { DocupaxxPage } from "../common/DocupaxxPage";
import { SessionContext } from "../common/session/SessionContextManager";
import { FEATURES, FeatureSet } from "../support/FeaturesPage";
import { TESTIMONIALS, TestimonialSet } from "../support/TestimonialsPage";

/**
 * HomePage
 */
export const HomePage = () => {
  return (
    <DocupaxxPage>
      <HomeIntro />
      {/* <HomeOrganizationBox /> */}
      <HomeFeatures />
      <HomeTestimonials />
    </DocupaxxPage>
  );
};

/**
 * HomeIntro
 */
const HomeIntro = () => {
  return (
    <Segment
      inverted
      textAlign="center"
      style={{ minHeight: 600, padding: "2em" }}
      vertical
    >
      <Container text>
        <HomeIntroTitle />
        <HomeIntroDescription />
        <HomeIntroGetStartedButton />
      </Container>
    </Segment>
  );
};

/**
 * HomeFeatures
 */
const HomeFeatures = () => {
  const homeFeatureList = FEATURES.slice(0, 2);
  return <FeatureSet featureList={homeFeatureList} />;
};

/**
 * HomeTestimonials
 */
const HomeTestimonials = () => {
  const homeTestimonialTable = TESTIMONIALS.slice(0, 1);
  return <TestimonialSet testimonialTable={homeTestimonialTable} />;
};

/**
 * HomeIntroTitle
 */
const HomeIntroTitle = ({ mobile }) => {
  return (
    <Header
      as="h1"
      content="Docupaxx"
      inverted
      style={{
        fontSize: mobile ? "2.2em" : "4.4em",
        fontWeight: "normal",
        marginBottom: 0,
        marginTop: "1.6em",
      }}
    />
  );
};

/**
 * HomeIntroDescription
 */
const HomeIntroDescription = ({ mobile }) => {
  return (
    <Header
      as="h2"
      content="You can store your application documents and can apply to any organization uses Docupaxx"
      inverted
      style={{
        fontSize: mobile ? "1.5em" : "1.7em",
        fontWeight: "normal",
        marginTop: mobile ? "0.5em" : "1.5em",
      }}
    />
  );
};

/**
 * HomeIntroGetStartedButton
 */
const HomeIntroGetStartedButton = () => {
  const session = useContext(SessionContext);
  console.log(session);
  let link;
  if (!session) {
    link = null;
  } else if (session.type === "signedOut") {
    link = "/getstarted";
  } else if (session.type === "orgLead" || session.type === "orgMember") {
    link = `/organizations/${session.user.extension.organizationId}/dashboard`;
  } else if (session.type === "iUser") {
    link = `/users/${session.user.extension.id}/dashboard`;
  }

  return (
    // viewerId={session.user.extension.organizationId}
    <Link to={link}>
      <Button primary size="huge" style={{ marginTop: "1.5em" }}>
        {session?.type === "signedOut"
          ? "Let's get started"
          : "Go to your dashboard"}
        <Icon name="right arrow" />
      </Button>
    </Link>
  );
};
