import Joi from "joi";
import { useState } from "react";
import { useHistory } from "react-router";
import { Button, Container, Form, Header } from "semantic-ui-react";
import { DocupaxxPage } from "../common/DocupaxxPage";
import { ExitModalButton } from "../common/form/ExitModalButton";
import { makeFormData } from "../common/form/FormData";
import { ValidatingFormTextAreaInput } from "../common/form/input/ValidatingFormTextAreaInput";
import { ValidatingFormTextFieldInput } from "../common/form/input/ValidatingFormTextFieldInput";
import { MultilineBreak } from "../common/MultilineBreak";
import { request } from "../util/request";
import { convertCamelCaseToTitleText } from "../util/stringUtils";

/**
 * ContactUsPage
 */

// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey('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');
// const msg = {
//   to: 'rigog07@live.com',
//   from: 'rigorojas158@gmail.com',
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// };

// sgMail.send(msg, function (err, info) {
//   if (err) {
//     console.log("Email not sent");
//   } else {
//     console.log("Email sent successful");
//   }
// });

export const ContactUsPage = () => {
  const [formData, setFormData] = useState(makeFormData(["firstName", "lastName", "email", "description"]))
  const history = useHistory()
  return (
    <DocupaxxPage>
      <Container text>
        <Container text style={{ marginTop: "90px" }} />
        <ContactUsHeading />
        {/* Registered User contact us form functionality*/}
        <Header as="h2">Contact Form</Header>
        <Form onSubmit={() => submitAction(formData, null)} attached fluid segment>
          <ContactUsFirstNameInput formData={formData} setFormData={setFormData} />
          <ContactUsLastNameInput formData={formData} setFormData={setFormData} />
          <ContactUsEmailInput formData={formData} setFormData={setFormData} />
          <ContactUsDescriptionInput formData={formData} setFormData={setFormData} />
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
 * ContactUsFirstNameInput
 */
const ContactUsFirstNameInput = ({ formData, setFormData }) => {
  return (
    <ContactUsPartialNameInput formKey="firstName" formData={formData} setFormData={setFormData} />
  )
}



/**
 * ContactUsLastNameInput
 */
const ContactUsLastNameInput = ({ formData, setFormData }) => {
  return (
    <ContactUsPartialNameInput formKey="lastName" formData={formData} setFormData={setFormData} />
  )
}



/**
 * ContactUsEmailInput
 */
const ContactUsEmailInput = ({ formData, setFormData }) => {
  const formKey = "email"
  const frontendValidationRequirements = Joi.string()
    .email({ tlds: { allow: false } })
    .label(convertCamelCaseToTitleText(formKey))
  return (
    <ValidatingFormTextFieldInput
      formKey={formKey}
      validating={false}
      frontendValidationRequirements={frontendValidationRequirements}
      formData={formData}
      setFormData={setFormData}
    />
  )
}



/**
 * ContactUsDescriptionInput
 */
const ContactUsDescriptionInput = ({ formData, setFormData }) => {
  return (
    <ValidatingFormTextAreaInput
      formKey="description"
      placeholder="Let us know your Concern ..."
      formData={formData}
      setFormData={setFormData}
    />
  )
}



/**
 * ContactUsHeading
 */
const ContactUsHeading = () => {
  return (
    <>
      {/* Header to display Docupaxx contact information */}
      <Header as="h2">Contact Information</Header>
      <p>
        For your safety and the safety of all our personnel, we will work
        remotely and virtually to conduct all business. Please call
        #1-800-docupaxx or email docupaxx@mail.org as always with any
        questions. All phone calls and emails will be checked and answered
        during regular business hours.
          </p>
    </>
  )
}



/**
 * ContactUsPartialNameInput
 */
const ContactUsPartialNameInput = ({ formKey, formData, setFormData }) => {
  const frontendValidationRequirements = Joi.string()
    .min(3)
    .max(32)
    .required()
    .label(convertCamelCaseToTitleText(formKey))
  return (
    <ValidatingFormTextFieldInput
      formKey={formKey}
      validating={false}
      frontendValidationRequirements={frontendValidationRequirements}
      formData={formData}
      setFormData={setFormData}
    />
  )
}

require('dotenv').config()
const SENDER_EMAIL = `rigog02@live.com`
const RECIEVER_EMAIL = 'rigorojas158@gmail.com'
const API_KEY = (process.env.SENDGRID_API_KEY)



const submitAction = ({ formData, history }) => {
  // Axios.post("http://localhost:3000/contactUs")

  alert(JSON.stringify(formData))

  const firstName = formData["firstName"].value
  const lastName = formData["lastName"].value
  const email = formData["email"].value
  const description = formData["description"].value

request("/users/sendemail", {
  method: "POST",
  mock: false,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    firstName,
    lastName,
    email,
    description
  }),

})
}
