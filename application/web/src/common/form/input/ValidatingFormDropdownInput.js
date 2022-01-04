import { Container, Form } from "semantic-ui-react";
import { convertCamelCaseToTitleText } from "../../../util/stringUtils";
import { ValidatingInput } from "./ValidatingInput";

/**
 * ValidatingFormTextDropdownInput
 */
export const ValidatingFormTextDropdownInput = ({ formKey, title=convertCamelCaseToTitleText(formKey), placeholder=`Enter your ${title}`, validating=false, formData, setFormData, frontendValidationActions=[], backendValidationActions=[], options=[] }) => {
    return (
        <ValidatingInput
            formKey={formKey}
            validating={validating}
            frontendValidationActions={frontendValidationActions}
            backendValidationActions={backendValidationActions}
            formData={formData}
            setFormData={setFormData}
            makeControl={(handleOnValueUpdate) => (
                <Container vertical>
                    <Form.Dropdown
                        label={title}
                        options={options}
                        placeholder={placeholder}
                        selection
                        required
                        style={{ marginBottom: "10px", width: "98%" }}
                        value={formData[formKey].value}
                        onChange={(e, { value }) => handleOnValueUpdate(value)}
                    />
                </Container>
            )}
        />
    );
}