/**
 * Header
 *
 * Displays Featured Supportive Pages for a Signed Out User
 * Displays the Login and Signup buttons for a Signed Out User
 */
import { useContext, useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import { Button, Container, Image, Menu, Segment } from "semantic-ui-react";
import { request } from "../../util/request";
import { OrganizationSearchContainer } from "../search/OrganizationSearchContainer";
import { SessionContext } from "../session/SessionContextManager";
import logoImage from "./logo.png"

/**
 * DocupaxxHeader
 */
export const DocupaxxHeader = () => {
  const sessionTypeEquals = (session, type) => session && session.type === type;
  const session = useContext(SessionContext);

  return (
    <Segment vertical inverted={true} style={{ minHeight: "10vh" }}>
      <Container>
        <Menu inverted={true} secondary size="large" stackable>
          {sessionTypeEquals(session, "signedOut") && (
            <DocupaxxSignedOutHeader />
          )}
          {sessionTypeEquals(session, "iUser") && (
            <DocupaxxSignedInHeader
              viewerName={session.user.name}
              viewerId={session.user.extension.id}
              viewerDashboardToken={session.dashboardToken}
            />
          )}
          {sessionTypeEquals(session, "orgLead") && (
            <DocupaxxSignedInHeader
              viewerName={session.user.name}
              viewerId={session.user.extension.organizationId}
              viewerDashboardToken={session.dashboardToken}
              organizationHeader="true"
            />
          )}
          {sessionTypeEquals(session, "orgMember") && (
            <DocupaxxSignedInHeader
              viewerName={session.user.name}
              viewerId={session.user.extension.organizationId}
              viewerDashboardToken={session.dashboardToken}
            />
          )}
          {sessionTypeEquals(session, "admin") && (
            <DocupaxxSignedInHeader
              viewerName={session.user.name}
              viewerId={session.user.extension.id}
              viewerDashboardToken={"admins"}
            />
          )}
        </Menu>
      </Container>
    </Segment>
  );
};

/**
 * DocupaxxSignedOutHeader
 */
const DocupaxxSignedOutHeader = () => {
  return (
    <>
      <FeaturedPageItems />
      <EntryPageItems />
    </>
  );
};

/**
 * DocupaxxSignedInHeader
 */
const DocupaxxSignedInHeader = ({
  viewerName,
  viewerDashboardToken,
  viewerId,
  organizationHeader = false,
}) => {
  const history = useHistory();
  const [organizationName, setOrganizationName] = useState("");

  if (organizationHeader) {
    request(`/organizations/${viewerId}`).then((organization) => {
      setOrganizationName(organization.name);
    });
  }

  return (
    <Menu inverted pointing={false} fluid borderless size="massive" stackable>
      <Menu.Item header as={Link} to="/home">
        <LogoImage />
      </Menu.Item>
      <Menu.Item header>
        {organizationHeader
          ? `${viewerName} @${organizationName}`
          : `${viewerName}`}
      </Menu.Item>
      <Menu.Item>
        <OrganizationSearchContainer size="mini" />
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item
          as={Link}
          to={`/${viewerDashboardToken}/${viewerId}/dashboard`}
        >
          Dashboard
        </Menu.Item>
        <Menu.Item onClick={() => logoutAction(history)} as={Link} to="/home">
          Log out
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

/**
 * FeaturedPageItems
 * @param mobile is used for determining how homepageheading should be rendered
 */
const FeaturedPageItems = ({ mobile }) => {
  const { url } = useRouteMatch();
  const menu = mobile ? (
    <MobileFeaturedPageItems />
  ) : (
    <>
      <Link to="/home">
        <Menu.Item style={{ top: "-7px"}} as="a" href="/home">
         <LogoImage topPixels={"0"} />
        </Menu.Item>
      </Link>
      <Link to="/features">
        <Menu.Item as="a" style={{ top: "7px"}} active={url.includes("features")}>
          Features
        </Menu.Item>
      </Link>
      <Link to="/testimonials">
        <Menu.Item as="a" style={{ top: "7px"}} active={url.includes("testimonials")}>
          Testimonials
        </Menu.Item>
      </Link>
    </>
  );
  return menu;
};

const LogoImage = ({ topPixels="0" }) => {
  return (
    <Image src={logoImage} style={{ top: `${topPixels}px` }} size="tiny" />
  )
}

/**
 * MobileFeaturedPageItems
 */
export const MobileFeaturedPageItems = () => {
  return (
    <>
      <Link to="/home">
        <Menu.Item as="a" active>
          Docupaxx
        </Menu.Item>
      </Link>
      <Link to="/features">
        <Menu.Item as="a">Features</Menu.Item>
      </Link>
      <Link to="/testimonials">
        <Menu.Item as="a">Testimonials</Menu.Item>
      </Link>
    </>
  );
};

/**
 * EntryPageItems
 */
const EntryPageItems = () => {
  return (
    <Menu.Item position="right">
      <Link to="/login">
        <Button as="a" inverted={true} style={{ marginLeft: "0.5em" }}>
          Login
        </Button>
      </Link>
      <Link to="/getstarted">
        <Button as="a" inverted={true} style={{ marginLeft: "0.5em" }}>
          Sign Up
        </Button>
      </Link>
    </Menu.Item>
  );
};

/**
 * loadExistingSession
 */
export const loadExistingSession = (loaded, setLoaded, setSession) => {
  if (!loaded) {
    request(`/sessions`)
      .then((sessions) => {
        //alert("Success: " + JSON.stringify(sessions))
        const session = sessions[0];
        setSession(session);
        setLoaded(true);
      })
      .catch((error) => "Error: " + JSON.stringify(error));
  }
};

/**
 * logoutAction
 */
const logoutAction = (history) => {
  request("/sessions/1", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "signedOut",
      user: {},
      dashboardToken: "",
      message: "",
      messageHeader: "",
      status: "",
      count: "",
    }),
  }).then((data) => {
    if (window.location.href.includes("/home")) {
      window.location.reload();
    }
    history.push("/home");
  });
};
