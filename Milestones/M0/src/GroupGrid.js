import React from "react";
import { Container, Grid, Header } from "semantic-ui-react";
import ProfileCard from "./ProfileCard";
import { Link } from "react-router-dom";
import { people } from "./utils/people";

export function GroupGrid() {
  return (
    <Container text textAlign="center">
      <Header as="h2">People behind TEAM7</Header>
      <Grid padded>
        <Grid.Row columns={3}>
          {Object.entries(people).map(([nickname, person]) => {
            return (
              <Grid.Column key={nickname}>
                <Link to={`/team/${nickname}`}>
                  <ProfileCard
                    name={person.name}
                    role={person.role}
                    profileImage={person.profileImage}
                  />
                </Link>
              </Grid.Column>
            );
          })}
        </Grid.Row>
      </Grid>
    </Container>
  );
}
