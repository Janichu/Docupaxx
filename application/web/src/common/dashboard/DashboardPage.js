/**
 * User Dashboard
 *
 * Contains all the Tabs of a User
 */
import { useContext } from "react";
import { Link, Route, Switch, useParams } from "react-router-dom";
import { Grid, Menu, Segment } from "semantic-ui-react";
import { freeze } from "../../util/freeze";
import { request } from "../../util/request";
import { DocupaxxPage } from "../DocupaxxPage";
import { SessionContext } from "../session/SessionContextManager";

/**
 * DashboardModel
 */
export const DashboardModel = ({ dashboardToken }) =>
  freeze({
    dashboardToken,
  });

/**
 * DashboardPage
 */
export const DashboardPage = ({
  dashboardToken,
  viewerId,
  menuItemList,
  routeList,
}) => {
  const session = useContext(SessionContext);
  const { id, section } = useParams();
  return (
    <DocupaxxPage>
      {sessionIdEquals(session, id) ? (
        <Grid padded>
          <DashboardMenu
            dashboardToken={dashboardToken}
            viewerId={viewerId}
            section={section}
            menuItemList={menuItemList}
          />
          <DashboardContentColumn routeList={routeList} />
        </Grid>
      ) : (
        <BlockSegment session={session}/>
      )}
    </DocupaxxPage>
  );
};


/**
 * BlockSegment
 */
const BlockSegment = ({ session }) => {
  return (
        <Segment color="gray" textAlign="center">
          <p>This page does not exist, the account is disabled, or you currently do
          not have access rights to this page.</p>
          <p>Reminder that Personal Users must verify their email to have access
          their account.</p>
        </Segment>
  )
}

/**
 * DashboardMenu
 */
const DashboardMenu = ({ dashboardToken, viewerId, section, menuItemList }) => {
  return (
    <Grid.Column tablet={3} computer={3} only="tablet computer" id="sidebar">
      <Grid.Row stretched>
        <Menu vertical size="huge" secondary fluid>
          {menuItemList.map((item) => (
            <Menu.Item
              as={Link}
              to={`/${dashboardToken}/${viewerId}/dashboard/${item.section}`}
              color={section === `${item.section}` ? "red" : "black"}
              active={section === `${item.section}`}
            >
              {item.title}
            </Menu.Item>
          ))}
        </Menu>
      </Grid.Row>
    </Grid.Column>
  );
};

// The Switch elements allows switching between tabs in the Dashboard

/**
 * DashboardContentColumn
 */
const DashboardContentColumn = ({ routeList }) => {
  return (
    <Grid.Column mobile={16} tablet={13} computer={13}>
      <Switch>
        {routeList.map((route) => (
          <Route exact path={route.path} component={route.component} />
        ))}
      </Switch>
    </Grid.Column>
  );
};

const sessionIdEquals = (session, id) => {
  //alert(JSON.stringify(session))
  if (!session || !session.user || !session.user.extension) {
    return false;
  }
  if (session.user.is_enabled == 0) {
    return false
  }
  const extension = session.user.extension;
  return (
    (extension.id && extension.id === id) ||
    (extension.organizationId && extension.organizationId === id)
  );
};
