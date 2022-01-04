import { Link } from "react-router-dom";
import { Button, Grid, Header } from "semantic-ui-react";
import { DocupaxxPage } from "../common/DocupaxxPage";
import { EntryBox } from "../common/form/entryform/EntryBox";

/**
 * SIGN_UP_OPTIONS
 */
const SIGN_UP_OPTIONS = [
    /* Columns conatining buttons to create personal account*/
    { 
        title: `I want to use Docupaxx as a Personal Account`,
        description: ``,
        buttonText: `Personal Account`,
        buttonRoute: `/signup`,
    },
    /* Columns conatining buttons to create account as orgnaization lead or member*/
    { 
        title: `I want to Sign Up as a Member of an Organization`,
        description: ``,
        buttonText: `Organization Member Account`,
        buttonRoute: `/signupOrganizationMember`,
    },
    /* Columns conatining buttons to create account as orgnaization lead or member*/
    { 
        title: `I want to Partner my Organization with Docupaxx`,
        description: ``,
        buttonText: `Organization Lead Account`,
        buttonRoute: `/signupOrganizationLead`,
    }
]



/**
 * GetStartedPage
 */
export const GetStartedPage = () => {
    return (
        <DocupaxxPage>
            <EntryBox
                title="Get Started!"
                marginLeft="20vw"
                maxWidth="60vw"
                headerMessageTitle="Welcome to Docupaxx!"
                headerMessageDescription="Choose an account type below to get started."
                useSubmitButton={false}
                footerChildren={
                    <>
                        Already signed up?&nbsp;<a href='./login'>Login here</a>&nbsp;instead.
                    </>
                }
            >
                <Grid columns="3" divided>
                    <Grid.Row>
                        {SIGN_UP_OPTIONS.map((option) => (
                            <GetStartedBox 
                                title={option.title}
                                description={option.description}
                                buttonText={option.buttonText}
                                to={option.buttonRoute}
                            />
                        ))}
                    </Grid.Row>
                </Grid>
            </EntryBox>
        </DocupaxxPage>
    )
}



/**
 * GetStartedBox
 */
const GetStartedBox = ({ title, description, buttonText, to }) => {
    return (
        <Grid.Column verticalAlign="middle">
            <Header as="h2" position="top">
                {title}
            </Header>
            <p>{description}</p>
            <Link to={to}>
                <Button
                    position="bottom"
                    content={buttonText}
                    primary
                    size="big"
                    style={{ marginTop: "30px", height: "60px" }}
                />
            </Link>
        </Grid.Column>
    )
}