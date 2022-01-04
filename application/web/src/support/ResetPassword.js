/**
 * Reset Password (unused yet)
 */
import { Link } from "react-router-dom";
import { Button, Form, Grid, Header, Segment } from "semantic-ui-react";


/**
 * Reset Password (unused yet)
 */
export const ResetPassword = () => (
    <div>
        <HomepageMenu inverted={false} />
        <Grid textAlign='center' style={{ height: '90vh' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 500 }}>
               
                <Header as='h2' color='black' textAlign='center'>
                    Reset Password
                </Header>
                <p>
                Your password must be atleast eight characters long.
                </p>

                <Form size='large'>
                    <Segment stacked>
                        <Form.Input label='Old Password' type='password' />
                        <Form.Input label='New Password' type='password' />
                        <Form.Input label='Confirm Password' type='password'  />
                        <Button color='blue' size='medium'  >
                            Reset
                        </Button>
                        <Link to='./home'>
                            <Button class="medium"  >
                                Exit
                        </Button>
                        </Link>
                    </Segment>
                </Form>
            </Grid.Column>
        </Grid>
    </div>
);


