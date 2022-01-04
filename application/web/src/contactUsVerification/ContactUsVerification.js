import Joi from "joi";
import { useState } from "react";
import { Button, Container, Form, Header } from "semantic-ui-react";
import { DocupaxxPage } from "../common/DocupaxxPage";
import { ExitModalButton } from "../common/form/ExitModalButton";
import { makeFormData } from "../common/form/FormData";
import { ValidatingFormTextAreaInput } from "../common/form/input/ValidatingFormTextAreaInput";
import { ValidatingFormTextFieldInput } from "../common/form/input/ValidatingFormTextFieldInput";
import { MultilineBreak } from "../common/MultilineBreak";
import { request } from "../util/request";
import { convertCamelCaseToTitleText } from "../util/stringUtils";
import { useParams } from "react-router-dom";


export const ContactUsVerification = () => {
    const [formData, setFormData] = useState(makeFormData(["passcode"]))

    const { userId } = useParams()

    return (

        <DocupaxxPage>
            <Container text>
                <Container text style={{ marginTop: "90px" }} />
                {/* <ContactUsHeading /> */}
                {/* Registered User contact us form functionality*/}
                <Header as="h2">Contact Verification</Header>
                <Form onSubmit={() => submitAction(formData, null)} attached fluid segment>
                    <VerfirificationPasscodeFieldInput formData={formData} setFormData={setFormData} />

                    {/* Button to let user submit information  */}
                    <Button color="blue">Submit</Button>
                    <ExitModalButton />
                </Form>
            </Container>
            <MultilineBreak lines={4} />
        </DocupaxxPage>

    );

};


/**
 * ContactUsEmailInput
 */
const VerfirificationPasscodeFieldInput = ({ formData, setFormData }) => {
    const formKey = "passcode"
    const frontendValidationRequirements = Joi.string()
        .email({ tlds: { allow: false } })
        .label(convertCamelCaseToTitleText(formKey))
    return (
        <ValidatingFormTextFieldInput
            formKey={formKey}
            validating={false}
            formData={formData}
            setFormData={setFormData}
        />
    )
}

const submitAction = ({ formData, history }) => {
    const passcode = formData["passcode"].value
    const userId = formData["userId"].value
    request(`/users/emailValidate?passcode=${passcode}&userid=${userId}`)
        .then((data) => {

            return data.JSON()
        })
        .catch(error => console.log(error));

    request(`/users/${userId}`, {
        method: "PATCH",
        mock: false,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            passcode: "12345678",
            verified: "0"
        }),

    })

}
