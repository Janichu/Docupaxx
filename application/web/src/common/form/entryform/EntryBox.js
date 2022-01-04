import { Link } from "react-router-dom";
import { Button, Form, Grid, Header, Icon, Message, Segment } from "semantic-ui-react";

/**
 * EntryBox
 */
export const EntryBox = ({ children, title, marginLeft, maxWidth, headerMessageTitle, headerMessageDescription, useSubmitButton=true, onSubmit, submitButtonText, footerChildren }) => {
    return (
        <>
            <Grid
                style={{ marginLeft: marginLeft, marginTop: "14vh", marginBottom: "14vh" }}
                verticalAlign="middle"
            >
                <Grid.Column style={{ maxWidth: maxWidth }}>
                    <EntryBoxHeading 
                        headerTitle={title}
                        messageTitle={headerMessageTitle}
                        messageContent={headerMessageDescription}
                    />
                        <Form size="large">
                            <Segment stacked>
                                {children}
                                {useSubmitButton && (
                                    <Button fluid size="large" onClick={onSubmit} color="blue">
                                        {submitButtonText}
                                    </Button>
                                )}
                            </Segment>
                        </Form>
                    <EntryBoxFooter>
                        {footerChildren}
                    </EntryBoxFooter>
                </Grid.Column>
            </Grid>
        </>
    )
}




/**
 * EntryBoxHeading
 */
const EntryBoxHeading = ({ headerTitle, messageTitle, messageContent }) => {
    return (
        <>
            <Header as="h2" color="black" textAlign="center">
                {headerTitle}
            </Header>
            <Message
                attached
                header={messageTitle}
                content={messageContent}
            />
        </>
    );
}



/**
 * EntryBoxFooter
 */
const EntryBoxFooter = ({ children }) => {
    return (
        <>
            <Message attached="bottom" warning>
                <Icon name="help" />
                    {children}
                <Link to="./home">
                <Button style={{ marginTop: "-10px" }} floated="right">
                    Exit
                </Button>
                </Link>
            </Message>
        </>
    )
}