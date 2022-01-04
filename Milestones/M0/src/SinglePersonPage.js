import React from "react";
import { useParams } from "react-router";
import { Navbar } from "./Navbar";
import { Container, Grid, Header, Icon, Image } from "semantic-ui-react";
import { people } from "./utils/people";
import { Link } from "react-router-dom";

export function SinglePersonPage() {
  const { name } = useParams();

  const person = people[name];
  return (
    <div>
      <Navbar activeItem="team" />
      <Container text style={{ marginTop: 25 }}>
        <Grid divided="vertically">
          <Grid.Row>
            <Grid.Column width={5}>
              <Image src={person.profileImage} />
            </Grid.Column>
            <Grid.Column width={10}>
              <Header as="h1" dividing>
                <Header.Content>
                  {person.name}
                  <Header.Subheader>{person.role}</Header.Subheader>
                </Header.Content>
              </Header>
              <p>{person.description}</p>
              <Link to={{pathname: `https://github.com/${person.github}`}} target="_blank">
              <Icon name="github" size="large" />
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
}
