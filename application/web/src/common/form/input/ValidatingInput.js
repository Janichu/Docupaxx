import { useState } from "react";
import { Message } from "semantic-ui-react";
import { cloneFormData, cloneFormDataWithNewValue } from "../FormData";

/**
 * INITIAL_VALIDATION_STATE
 */
const INITIAL_VALIDATION_STATE = {
  value: "",
  validatingTimeout: 0,
};

/**
 * ValidatingInput
 */
export const ValidatingInput = ({
  formKey,
  frontendValidationActions = [],
  backendValidationActions = [],
  validating = anyValidationActionsPresent(
    frontendValidationActions,
    backendValidationActions
  ),
  formData,
  setFormData,
  makeControl,
}) => {
  const [validationState, setValidationState] = useState(
    INITIAL_VALIDATION_STATE
  );
  const [statusMessageList, setStatusMessageList] = useState([]);
  const [success, setSuccess] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const handleOnValueUpdate = makeHandleValueOnUpdateFunction({
    validating,
    formKey,
    formData,
    validationState,
    setFormData,
    setValidationState,
    setStatusMessageList,
    setSuccess,
    frontendValidationActions,
    backendValidationActions,
  });
  const control = makeControl(handleOnValueUpdate);
  if (!validating && firstLoad) {
    setSuccessByDefault(
      formKey,
      formData,
      setFormData,
      setSuccess,
      setFirstLoad
    );
  }
  return (
    <>
      {control}
      {validating && statusMessageList?.length > 0 && (
        <Message
          negative={!success}
          positive={success}
          style={{ width: "96%" }}
        >
          <Message.List>
            {Object.entries(statusMessageList).map(
              ([statusMessageKey, statusMessageValue]) => {
                return (
                  <Message.Item
                    key={statusMessageKey}
                    header={success ? "Action Available" : "Action Forbidden"}
                    content={statusMessageValue.message}
                  />
                );
              }
            )}
          </Message.List>
        </Message>
      )}
    </>
  );
};

/**
 * anyValidationActionsPresent
 */
const anyValidationActionsPresent = (
  frontendValidationActions,
  backendValidationActions
) => {
  return (
    frontendValidationActions.length > 0 || backendValidationActions.length > 0
  );
};

/**
 * makeHandleValueOnUpdateFunction
 */
const makeHandleValueOnUpdateFunction = ({
  validating,
  formKey,
  formData,
  validationState,
  setFormData,
  setValidationState,
  setStatusMessageList,
  setSuccess,
  frontendValidationActions,
  backendValidationActions,
}) => {
  return (newValue) => {
    setFormData(cloneFormDataWithNewValue(formData, formKey, newValue));
    if (validationState.validatingTimeout) {
      clearTimeout(validationState.validatingTimeout);
    }
    setValidationState({
      value: newValue,
      validatingTimeout: setTimeout(
        () =>
          validateField(
            validating,
            formKey,
            frontendValidationActions,
            backendValidationActions,
            newValue,
            formData,
            setFormData,
            setStatusMessageList,
            setSuccess
          ),
        200
      ),
    });
  };
};

/**
 * validateField
 */
const validateField = (
  validating,
  formKey,
  frontendValidationActions,
  backendValidationActions,
  newValue,
  formData,
  setFormData,
  setStatusMessageList,
  setSuccess
) => {
  if (!validating) {
    return;
  }
  const validationActions = frontendValidationActions.concat(
    backendValidationActions
  );
  const validationsOnNewValue = validationActions.map((action) =>
    action(newValue)
  );
  Promise.all(validationsOnNewValue)
    .then((successMessagesFromEachValidation) => {
      const successMessages =
        successMessagesFromEachValidation[
          successMessagesFromEachValidation.length - 1
        ];
      setStatus(
        formKey,
        formData,
        newValue,
        successMessages,
        true,
        setFormData,
        setStatusMessageList,
        setSuccess
      );
    })
    .catch((errorMessages) => {
      setStatus(
        formKey,
        formData,
        newValue,
        errorMessages,
        false,
        setFormData,
        setStatusMessageList,
        setSuccess
      );
    });
};

/**
 * setStatus
 */
const setStatus = (
  formKey,
  formData,
  newValue,
  messageList,
  success,
  setFormData,
  setStatusMessageList,
  setSuccess
) => {
  const newFormData = cloneFormData(formData);
  const newFormField = {
    ...newFormData[formKey],
  };
  newFormField.value = newValue;
  newFormField.success = success;
  newFormField.messageList = messageList;
  newFormData[formKey] = newFormField;
  setFormData(newFormData);
  setStatusMessageList(messageList);
  setSuccess(success);
};

/**
 * setSuccessByDefault
 */
const setSuccessByDefault = (
  formKey,
  formData,
  setFormData,
  setSuccess,
  setFirstLoad
) => {
  const newFormData = cloneFormData(formData);
  const newFormField = {
    ...newFormData[formKey],
  };
  newFormField.success = true;
  newFormField.messageList = [];
  newFormData[formKey] = newFormField;
  setFormData(newFormData);
  setSuccess(true);
  setFirstLoad(false);
};
