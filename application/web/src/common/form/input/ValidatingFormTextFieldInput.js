import { Form } from "semantic-ui-react";
import {
  convertCamelCaseToHyphenText,
  convertCamelCaseToTitleText,
} from "../../../util/stringUtils";
import { backendUsernameValidationActions } from "./BackendValidationInterface";
import {
  alphanumericMandatoryStringRequirements,
  makeFrontendValidationActions,
  mandatoryEmailRequirements,
} from "./FrontendValidationRequirements";
import { ValidatingInput } from "./ValidatingInput";

/**
 * ValidatingUsernameInput
 */
export const ValidatingUsernameInput = ({
  formData,
  setFormData,
  icon = 0,
  iconPosition = 0,
  validating = true,
}) => {
  const usernameRequirements = alphanumericMandatoryStringRequirements(
    "Username",
    3,
    32
  );
  return (
    <ValidatingFormTextFieldInput
      formKey="username"
      validating={validating}
      frontendValidationRequirements={usernameRequirements}
      backendValidationActions={backendUsernameValidationActions()}
      defaultSuccessMessage={"Username is available!"}
      formData={formData}
      icon={icon}
      iconPosition={iconPosition}
      setFormData={setFormData}
      required={true}
    />
  );
};

/**
 * ValidatingEmailInput
 */
export const ValidatingEmailInput = ({
  formData,
  setFormData,
  icon = 0,
  iconPosition = 0,
  validating = true,
  successMessage,
}) => {
  const emailRequirements = mandatoryEmailRequirements();
  return (
    <ValidatingFormTextFieldInput
      formKey="email"
      validating={validating}
      frontendValidationRequirements={emailRequirements}
      defaultSuccessMessage={successMessage}
      formData={formData}
      icon={icon}
      iconPosition={iconPosition}
      setFormData={setFormData}
      required={true}
    />
  );
};

/**
 * ValidatingPasswordInput
 */
export const ValidatingPasswordInput = ({
  formData,
  setFormData,
  icon = 0,
  iconPosition = 0,
  validating = true,
}) => {
  const passwordRequirements = alphanumericMandatoryStringRequirements(
    "Password",
    8,
    32
  );
  return (
    <ValidatingFormTextFieldInput
      formKey="password"
      validating={validating}
      frontendValidationRequirements={passwordRequirements}
      defaultSuccessMessage={"Password is valid!"}
      icon={icon}
      iconPosition={iconPosition}
      formData={formData}
      setFormData={setFormData}
      required={true}
      password={true}
    />
  );
};

/**
 * ValidatingOrganizationNameInput
 */
export const ValidatingOrganizationNameInput = ({
  formData,
  setFormData,
  icon = 0,
  iconPosition = 0,
  validating = true,
}) => {
  const organizationNameRequirements = alphanumericMandatoryStringRequirements(
    "Organization Name",
    3,
    32
  );
  return (
    <ValidatingFormTextFieldInput
      formKey="organizationName"
      validating={validating}
      frontendValidationRequirements={organizationNameRequirements}
      defaultSuccessMessage={"Organization Name is available!"}
      formData={formData}
      icon={icon}
      iconPosition={iconPosition}
      setFormData={setFormData}
      required={true}
    />
  );
};

/**
 * ValidatingOrganizationNameInput
 */
export const ValidatingOrganizationAddressInput = ({
  formData,
  setFormData,
  icon = 0,
  iconPosition = 0,
  validating = true,
}) => {
  const organizationAddressRequirements = alphanumericMandatoryStringRequirements(
    "Organization Address",
    3,
    32
  );
  return (
    <ValidatingFormTextFieldInput
      formKey="organizationAddress"
      validating={validating}
      frontendValidationRequirements={organizationAddressRequirements}
      defaultSuccessMessage={"Organization Address is valid!"}
      formData={formData}
      icon={icon}
      iconPosition={iconPosition}
      setFormData={setFormData}
      required={true}
    />
  );
};

/**
 * ValidatingFormTextFieldInput
 */
export const ValidatingFormTextFieldInput = ({
  formKey,
  title = convertCamelCaseToTitleText(formKey),
  placeholder = `Enter your ${title}`,
  validating = true,
  formData,
  setFormData,
  frontendValidationRequirements,
  secondaryFrontendValidationActions = [],
  backendValidationActions = [],
  icon = 0,
  iconPosition = 0,
  required = true,
  password = false,
  defaultSuccessMessage,
}) => {
  const frontendValidationActions = makeFrontendValidationActions(
    formKey,
    validating,
    defaultSuccessMessage,
    frontendValidationRequirements,
    secondaryFrontendValidationActions
  );
  return (
    <ValidatingInput
      formKey={formKey}
      validating={validating}
      frontendValidationActions={frontendValidationActions}
      backendValidationActions={backendValidationActions}
      formData={formData}
      setFormData={setFormData}
      makeControl={(handleOnValueUpdate) => (
        <Form.Input
          fluid
          id={`${convertCamelCaseToHyphenText(formKey)}-text-field`}
          label={title}
          placeholder={placeholder}
          required={required}
          icon={icon}
          iconPosition={iconPosition}
          type={password ? "password" : "text"}
          value={formData[formKey].value}
          onChange={(e) => handleOnValueUpdate(e.target.value)}
        />
      )}
    />
  );
};
