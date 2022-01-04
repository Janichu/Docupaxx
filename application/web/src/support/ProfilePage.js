/**
 * Profile Page (unused yet)
 */
import { Link } from "react-router-dom";
import { Button, Card, Container, Form, Grid, Header, Icon, Segment, TextArea } from "semantic-ui-react";


/**
 * Profile Page (unused yet)
 */
export const ProfilePage = () => {
  return (
    <div>
      <HomepageMenu inverted={false} />
      <Container fluid>
        <Container text style={{ marginTop: "90px" }} />

        <Grid columns={2} stackable>
          <Grid.Column width={1} />
          <Grid.Column width={7}>
            <Segment>
              <Header as="h1">Profile</Header>
              <Placeholder style={{ height: 150, width: 150 }}>
                <Placeholder.Image />
              </Placeholder>
              <Icon name="edit" style={{ margin: 0 }} />
              <Icon name="delete" style={{ margin: 0 }} />
              <Card fluid>
                <Card.Content>
                  <Card.Header>Matthew</Card.Header>
                  <Card.Meta>Joined on date</Card.Meta>
                  <Card.Description>bio info</Card.Description>
                </Card.Content>
              </Card>
            </Segment>
          </Grid.Column>
          <Grid.Column width={7}>
            <Header as="h4">Personal Information</Header>

            <Form attached fluid segment>
              <Form.Input
                fluid
                label="First Name"
                placeholder="First Name"
                type="text"
              />
              <Form.Input
                fluid
                label="Last Name"
                placeholder="Last Name"
                type="text"
              />

              <Form.Input label="User Name" placeholder=" Name" type="text" />
              <Form.Input label="Email" placeholder="Email" type="text" />
              <Form.Field
                id="form-textarea-control-opinion"
                control={TextArea}
                label="Bio"
                placeholder="Add text ..."
              />
              <Form.Field
                id="form-textarea-control-opinion"
                control={TextArea}
                label="Contact info"
                placeholder="Add text ..."
              />

              <Button color="green">Save</Button>
              <Link to="./home">
                <Button
                  className="mini"
                  style={{ marginTop: "-3px" }}
                  floated="right"
                >
                  Exit
                </Button>
              </Link>
            </Form>
          </Grid.Column>
          <Grid.Column width={1} />
        </Grid>
      </Container>
    </div>
  );
};
