import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import { Button, Grid, Icon, List, Message } from "semantic-ui-react";
import { DocupaxxHeader } from "../common/header/DocupaxxHeader";
import { SessionContext } from "../common/session/SessionContextManager";
import { request } from "../util/request";

/**
 * OrganizationPackagePage
 */
export const OrganizationPackagePage = () => {
  const { id } = useParams();
  const history = useHistory();
  const [packages, setPackages] = useState({});
  const [organizationName, setOrganizationName] = useState("");
  useEffect(() => loadPackages(id, setPackages, setOrganizationName), [id]);
  const session = useContext(SessionContext);
  return (
    <>
      <DocupaxxHeader />
      <PackagePageGrid>
        {packages.length > 0 ? (
          <PackageSet
            user={session.user}
            organizationId={id}
            packages={packages}
            history={history}
          />
        ) : (
          <PackageAbsentMessage organizationName={organizationName} />
        )}
      </PackagePageGrid>
    </>
  );
};

/**
 * PackageSet
 */
const PackageSet = ({ packages, organizationId, user, history }) => {
  return (
    <>
      {packages.map((paxx) => {
        return (
          <PackageButton
            paxx={paxx}
            onClick={() => getPackage(organizationId, paxx, user, history)}
          />
        );
      })}
    </>
  );
};

/**
 * PackageAbsentContent
 */
const PackageAbsentMessage = ({ organizationName }) => {
  return <Message>{organizationName} didn't publish any packages yet.</Message>;
};

/**
 * PackagePageGrid
 */
const PackagePageGrid = ({ children }) => {
  return (
    <Grid textAlign="center" style={{ height: "90vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 1200 }}>
        <List size="huge" divided relaxed>
          {children}
        </List>
      </Grid.Column>
    </Grid>
  );
};

/**
 * PackageButton
 */
const PackageButton = ({ paxx, onClick }) => {
  return (
    <List.Item key={paxx.id}>
      <List.Icon name="folder" />
      <List.Content>
        <List.Content floated="right">
          <Button icon labelPosition="left" color="blue" onClick={onClick}>
            <Icon name="edit" /> Take this package to my dashboard
          </Button>
        </List.Content>
        <List.Header>{paxx.name}</List.Header>
        <List.Description>{paxx.description}</List.Description>
      </List.Content>
    </List.Item>
  );
};

/**
 * loadUserFromSession
 */
const loadUserFromSession = (setUser) => {
  request(`/sessions/`).then((sessions) => {
    setUser(sessions[0].user);
  });
};

/**
 * loadPackages
 */
const loadPackages = (organizationId, setPackages, setOrganizationName) => {
  request(`/organizations/${organizationId}`).then((organization) => {
    setOrganizationName(organization.name);
  });
  request(`/organizations/${organizationId}/arps`).then((packages) => {
    setPackages(packages);
  });
};

/**
 * getPackage
 */
 const getPackage = (organizationId, paxx, user, history) => {
  request(`/users/${user.extension.id}/getpackagefromorganization`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          name: paxx.name,
          organizationId
      }),
  })
  .then(() => {
      history.push(`/users/${user.extension.id}/dashboard`);
      window.location.reload(true)
  });
};
