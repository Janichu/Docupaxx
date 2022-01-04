import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Grid, Header, Message } from "semantic-ui-react";
import { getValueMap, isValidatedFormData, makeFormData } from "../common/form/FormData";
import { ValidatingFormTextDropdownInput } from "../common/form/input/ValidatingFormDropdownInput";
import { ValidatingEmailInput, ValidatingOrganizationAddressInput, ValidatingOrganizationNameInput, ValidatingPasswordInput, ValidatingUsernameInput } from "../common/form/input/ValidatingFormTextFieldInput";
import { request } from "../util/request";

/**
 * HomeOrganizationRegistrationForm
 */
export const HomeOrganizationRegistrationForm = () => {
    const keyList = [ "organizationName", "organizationAddress", "organizationType", "username", "email", "password" ]
    const initialFields = { "organizationType": { value: "school", success: true, messageList: [] } }
    const [formData, setFormData] = useState(makeFormData(keyList, initialFields))
    const resetForm = () => setFormData(makeFormData(keyList, initialFields))
    // Submit function for creation form of organizations
    const submit = (e) => registrationAction(formData, resetForm);
    return (
        <Grid.Row>
            <Grid.Column>
                <Form size="large" onSubmit={submit}>
                    <Header as="h2">Create an Organization</Header>
                    <HomeOrganizationNameInput formData={formData} setFormData={setFormData}/>
                    <HomeOrganizationAddressInput formData={formData} setFormData={setFormData}/>
                    <HomeOrganizationTypeInput formData={formData} setFormData={setFormData}/>
                    <HomeOrganizationUsernameInput formData={formData} setFormData={setFormData}/>
                    <HomeOrganizationEmailInput formData={formData} setFormData={setFormData}/>
                    <HomeOrganizationPasswordInput formData={formData} setFormData={setFormData}/>
                    <Message>
                        You are accepting the <Link to="/terms">Terms and Conditions</Link> by
                        creating an organization and organization lead
                    </Message>
                    <Button type="submit">Create an organization</Button>
                </Form>
            </Grid.Column>
        </Grid.Row>
    )
}



/**
 * HomeOrganizationNameInput
 */
const HomeOrganizationNameInput = ({ formData, setFormData }) => {
    return (
        <ValidatingOrganizationNameInput formData={formData} setFormData={setFormData} validating={true} />
    )
}



/**
 * HomeOrganizationAddressInput
 */
const HomeOrganizationAddressInput = ({ formData, setFormData }) => {
    return (
        <ValidatingOrganizationAddressInput formData={formData} setFormData={setFormData} validating={true} />
    )
}



/**
 * HomeOrganizationTypeInput
 */
const HomeOrganizationTypeInput = ({ formData, setFormData }) => {
    const organizationTypeOptions = [
        { key: "b", text: "Bank", value: "Bank" },
        { key: "i", text: "School", value: "School" },
        { key: "d", text: "Department", value: "Department" },
        { key: "o", text: "Other", value: "Other" },
    ];
    return (
        <ValidatingFormTextDropdownInput 
            formKey="organizationType"
            formData={formData}
            setFormData={setFormData}
            options={organizationTypeOptions}
        />
    )
}



/**
 * HomeOrganizationUsernameInput
 */
const HomeOrganizationUsernameInput = ({ formData, setFormData }) => {
    return (
        <ValidatingUsernameInput formData={formData} setFormData={setFormData} validating={true} />
    )
}



/**
 * HomeOrganizationEmailInput
 */
const HomeOrganizationEmailInput = ({ formData, setFormData }) => {
    return (
        <ValidatingEmailInput formData={formData} setFormData={setFormData} validating={true} />
    )
}



/**
 * HomeOrganizationPasswordInput
 */
const HomeOrganizationPasswordInput = ({ formData, setFormData }) => {
    return (
        <ValidatingPasswordInput formData={formData} setFormData={setFormData} validating={true} />
    )
}



/**
 * registrationAction
 */
 const registrationAction = (formData, resetForm) => {
    if (!isValidatedFormData(formData)) {
        alert("One of the fields is filled out incorrectly")
        return
    }
    const formDataValues = getValueMap(formData)
    const requestOptions = makeRequestOptions(formDataValues)
    const mockRequestOptions = makeMockRequestOptions(formDataValues)
    Promise.all([
        request(`/organizations`, requestOptions),
        request(`/organizations`, { ...mockRequestOptions, mock: true }),
    ])
    .then(() => {
        //alert("Organization was created")
        resetForm()
    })
    .catch(() => alert("Organization was unable to be created"))
}



/**
 * makeRequestOptions
 */
const makeRequestOptions = ({ organizationName, organizationAddress, organizationType, username, email, password }) => ({
    method: "POST",
    mock: false,
    headers: {
          "Content-Type": "application/json",
    },
    body: JSON.stringify({
        organizationName: organizationName,
        organizationAddress: organizationAddress,
        organizationType: organizationType,
        username: username,
        email: email,
        password: password,
    }),
})



/**
 * makeMockRequestOptions
 */
const makeMockRequestOptions = ({ organizationName, organizationAddress, organizationType, username, email, password }) => ({
    method: "POST",
     headers: {
          "Content-Type": "application/json",
    },
    body: JSON.stringify({
        organizationName: organizationName,
        organizationAddress: organizationAddress,
        organizationType: organizationType,
        username: username,
        email: email,
        password: password,
    }),
})








