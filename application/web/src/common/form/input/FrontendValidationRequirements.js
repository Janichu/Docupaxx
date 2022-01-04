import Joi from "joi";
import { pushAll } from "../../../util/arrayUtils";
import { ValidatingFormTextDropdownInput } from "./ValidatingFormDropdownInput";

/**
 * ValidatingFormTextDropdownInput
 */
export const makeFrontendValidationActions = (
  formKey,
  validating,
  defaultSuccessMessage,
  frontendValidationRequirements,
  secondaryFrontendValidationActions
) => {
  if (!validating) {
    return [];
  }
  const frontendValidationActions = [];
  if (frontendValidationRequirements) {
    pushFrontendValidationSchema(
      frontendValidationActions,
      formKey,
      frontendValidationRequirements,
      defaultSuccessMessage
    );
  }
  pushAll(frontendValidationActions, secondaryFrontendValidationActions);
  return frontendValidationActions;
};

/**
 * ValidatingFormTextDropdownInput
 */
export const alphanumericMandatoryStringRequirements = (title, min, max) => {
  return Joi.string()
    .min(min)
    .max(max)
    .regex(new RegExp(`^[a-zA-Z0-9]{${min},${max}}$`))
    .required()
    .messages({
      "string.base": `${title} must be a String`,
      "string.empty": `${title} must not be empty`,
      "string.min": `${title} must have at least ${min} characters`,
      "string.max": `${title} must have at most ${max} characters`,
      "string.pattern.base": `${title} must only have letters and numbers`,
      "any.required": `${title} is a required field`,
    });
};

export const stringCantBeEmptyRequirement = (title) => {
  return Joi.string()
    .required()
    .messages({
      "string.empty": `${title} must not be empty`,
      "any.required": `${title} is a required field`,
    });
};

/**
 * ValidatingFormTextDropdownInput
 */
export const mandatoryEmailRequirements = () => {
  return Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.base": `Email must be a String`,
      "string.empty": `Email must not be empty`,
      "string.email": `Email must be an email`,
      "any.required": `Email is a required field`,
    });
};

/**
 * ValidatingFormTextDropdownInput
 */
const pushFrontendValidationSchema = (
  frontendValidationActions,
  formKey,
  frontendValidationRequirements,
  defaultSuccessMessage
) => {
  const frontendValidationSchema = Joi.object().keys(
    keyPair(formKey, frontendValidationRequirements)
  );
  frontendValidationActions.push((newValue) => {
    const result = frontendValidationSchema.validate(
      keyPair(formKey, newValue)
    );
    if (result.error) {
      return Promise.reject(result.error.details);
    }
    return Promise.resolve([{ message: defaultSuccessMessage }]);
  });
};

/**
 * keyPair
 */
const keyPair = (key, value) => {
  const pair = {};
  pair[key] = value;
  return pair;
};
