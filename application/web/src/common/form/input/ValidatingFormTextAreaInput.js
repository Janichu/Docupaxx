import { Form, TextArea } from "semantic-ui-react";
import { convertCamelCaseToHyphenText, convertCamelCaseToTitleText } from "../../../util/stringUtils";
import { makeFrontendValidationActions } from "./FrontendValidationRequirements";
import { ValidatingInput } from "./ValidatingInput";

/**
 * ValidatingFormTextAreaInput
 */
export const ValidatingFormTextAreaInput = ({ formKey, title=convertCamelCaseToTitleText(formKey), placeholder=`Enter your ${title}`, validating=false, formData, setFormData, frontendValidationRequirements, secondaryFrontendValidationActions=[], backendValidationActions=[], defaultSuccessMessage="The entered text is valid!"}) => {
    const frontendValidationActions = makeFrontendValidationActions(formKey, validating, defaultSuccessMessage, frontendValidationRequirements, secondaryFrontendValidationActions)
    return (
        <ValidatingInput
            formKey={formKey}
            validating={validating}
            frontendValidationActions={frontendValidationActions}
            backendValidationActions={backendValidationActions}
            formData={formData}
            setFormData={setFormData}
            makeControl={(handleOnValueUpdate) => (
                <Form.Field
                    id={`${convertCamelCaseToHyphenText(formKey)}-text-area`}
                    control={TextArea}
                    label={title}
                    placeholder={placeholder}
                    value={formData[formKey].value}
                    onChange={(e) => handleOnValueUpdate(e.target.value)}
                />
            )}
        />
    );
}