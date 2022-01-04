import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Form } from "semantic-ui-react";
import { GENERAL_USER_MODEL } from "../../common/dashboard/dataitem/generaluser/GeneralUsersTab";
import { SettingsTab } from "../../common/dashboard/SettingsTab";
import {
  cloneFormDataWithNewValue,
  makeFormData,
} from "../../common/form/FormData";
import { alphanumericMandatoryStringRequirements } from "../../common/form/input/FrontendValidationRequirements";
import {
  ValidatingEmailInput,
  ValidatingFormTextFieldInput,
} from "../../common/form/input/ValidatingFormTextFieldInput";
import { request } from "../../util/request";

export const UserSettingsTab = () => {
  const [viewer, setViewer] = useState(null);
  const [formData, setFormData] = useState(
    makeFormData(["email", "newPassword"])
  );
  const [saved, setSaved] = useState(false);

  // Viewer Id
  const { id } = useParams();

  // Patches an organization when finished
  const save = (e) => {
    e.preventDefault();
    updateUser(id, formData, setSaved);
  };

  // Loads an user upon render
  useEffect(() => {
    loadUser(id, formData, setFormData, setSaved, setViewer);
  }, [id]);

  // Organization Settings Form
  return (
    <SettingsTab settingSubject={"User"} iconName={GENERAL_USER_MODEL.iconName}>
      <Form onSubmit={save}>
        {/* Shows Organization Description */}
        <ValidatingEmailInput
          formData={formData}
          setFormData={updateSaved(setFormData, setSaved)}
          successMessage="Email is available"
        />
        <UserNewPasswordInput
          formData={formData}
          setFormData={updateSaved(setFormData, setSaved)}
        />

        {/* Save Button */}
        <Button color="blue" disabled={saved} type="submit">
          Save
        </Button>
      </Form>
    </SettingsTab>
  );
};

const UserNewPasswordInput = ({ formData, setFormData }) => {
  const passwordRequirements = alphanumericMandatoryStringRequirements(
    "Password",
    8,
    32
  );
  return (
    <ValidatingFormTextFieldInput
      formKey={"newPassword"}
      password={true}
      frontendValidationRequirements={passwordRequirements}
      defaultSuccessMessage={"Password is valid!"}
      formData={formData}
      setFormData={setFormData}
    />
  );
};

const loadUser = (id, formData, setFormData, setSaved, setUser) => {
  request(`/users/${id}`).then((user) => {
    const formDataWithEmail = cloneFormDataWithNewValue(
      formData,
      "email",
      user.email
    );
    setFormData(formDataWithEmail);
    setUser(user);
    setSaved(true);
  });
};

/**
 * updateOrganization
 */
const updateUser = async (id, formData, setSaved) => {
  const newPassword = formData["newPassword"].value;
  const newEmail = formData["email"].value;

  let options;
  if (newPassword.length > 0) {
    options = { email: newEmail, newPassword: newPassword };
  } else {
    options = { email: newEmail };
  }

  request(`/users/${id}/update`, {
    method: "PATCH",
    body: JSON.stringify(options),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(() => {
    alert("Settings Saved!")
    setSaved(true)
    window.location.reload(true)
  });
};

/**
 * updateSaved
 */
const updateSaved = (setFormData, setSaved) => {
  return (formData) => {
    setSaved(false);
    setFormData(formData);
  };
};
