import { Grid, Header, Search, Segment } from "semantic-ui-react";
import { OrganizationSearchContainer } from "../common/search/OrganizationSearchContainer";
import { HomeOrganizationRegistrationForm } from "./HomeOrganizationRegistrationForm";

/**
 * HomeOrganizationBox
 */
export const HomeOrganizationBox = () => {
  return (
    <Segment style={{ padding: "8em 0em" }} vertical>
      <Grid container stackable textAlign="middle">
        <OrganizationSearchContainer
          header={
            <Header as="h2">Search for any Organization uses Docupaxx</Header>
          }
          size="big"
        />
        <HomeOrganizationRegistrationForm />
      </Grid>
    </Segment>
  );
};
