import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { List } from "semantic-ui-react";
import { DocupaxxPage } from "../common/DocupaxxPage";
import { EntryTextForm } from "../common/form/entryform/EntryTextForm";
import {
  getValueMap,
  isValidatedFormData,
  makeFormData,
} from "../common/form/FormData";
import { ValidatingFormTextDropdownInput } from "../common/form/input/ValidatingFormDropdownInput";
import {
  ValidatingEmailInput,
  ValidatingOrganizationNameInput,
  ValidatingPasswordInput,
  ValidatingUsernameInput,
} from "../common/form/input/ValidatingFormTextFieldInput";
import { request } from "../util/request";
import { isVisibleString } from "../util/stringUtils";

/**
 * SignupPage
 */
export const SignupPage = () => {
  const [formData, setFormData] = useState(
    makeFormData(["username", "email", "password"])
  );
  const history = useHistory();
  return (
    <DocupaxxPage>
      <SignupForm
        headerMessageTitle="Sign Up for Personal Use"
        headerMessageDescription="Fill out the form below to sign up for personal use."
        onSubmit={() => signupAction({ formData, history })}
      >
        <SignupUsernameInput formData={formData} setFormData={setFormData} />
        <SignupEmailInput formData={formData} setFormData={setFormData} />
        <SignupPasswordInput formData={formData} setFormData={setFormData} />
      </SignupForm>
    </DocupaxxPage>
  );
};

/**
 * SignupAsOrganizationLeadPage
 */
export const SignupAsOrganizationLeadPage = () => {
  const [firstLoad, setFirstLoad] = useState(true);
  const [formData, setFormData] = useState(
    makeFormData([
      "username",
      "organizationName",
      "organizationType",
      "email",
      "password",
    ])
  );
  const [organizationTypeOptions, setOrganizationTypeOptions] = useState([]);
  const history = useHistory();
  useEffect(() =>
    loadOrganizationTypeOptions(
      setOrganizationTypeOptions,
      firstLoad,
      setFirstLoad
    )
  );
  return (
    <DocupaxxPage>
      <SignupForm
        headerMessageTitle="Sign Up an Organization for Docupaxx"
        headerMessageDescription="Fill out the form below to sign up for an Organization and be the Organization's Lead."
        onSubmit={() =>
          signupAction({ formData, organizationExists: false, history })
        }
      >
        <SignupUsernameInput formData={formData} setFormData={setFormData} />
        <SignupNewOrganizationNameInput
          formData={formData}
          setFormData={setFormData}
        />
        <SignupNewOrganizationTypeInput
          formData={formData}
          setFormData={setFormData}
          organizationTypeOptions={organizationTypeOptions}
        />
        <SignupEmailInput formData={formData} setFormData={setFormData} />
        <SignupPasswordInput formData={formData} setFormData={setFormData} />
      </SignupForm>
    </DocupaxxPage>
  );
};

/**
 * SignupAsOrganizationMemberPage
 */
export const SignupAsOrganizationMemberPage = () => {
  const initialFields = {
    organizationName: {
      formData: "San Francisco State University",
      success: true,
      messageList: [],
    },
  };
  const [firstLoad, setFirstLoad] = useState(true);
  const [formData, setFormData] = useState(
    makeFormData(
      ["username", "organizationName", "email", "password"],
      initialFields
    )
  );
  const [organizationOptions, setOrganizationsOptions] = useState([]);
  const history = useHistory();
  useEffect(() =>
    loadOrganizationOptions(setOrganizationsOptions, firstLoad, setFirstLoad)
  );
  return (
    <DocupaxxPage>
      <SignupForm
        headerMessageTitle="Sign Up an Organization for Docupaxx"
        headerMessageDescription="Fill out the form below to sign up as a member for an Organization."
        onSubmit={() =>
          signupAction({ formData, organizationExists: true, history })
        }
      >
        <SignupUsernameInput formData={formData} setFormData={setFormData} />
        <SignupExistingOrganizationNameInput
          formData={formData}
          setFormData={setFormData}
          organizationOptions={organizationOptions}
        />
        <SignupEmailInput formData={formData} setFormData={setFormData} />
        <SignupPasswordInput formData={formData} setFormData={setFormData} />
      </SignupForm>
    </DocupaxxPage>
  );
};

/**
 * SignupUsernameInput
 */
const SignupUsernameInput = ({ formData, setFormData }) => {
  return (
    <ValidatingUsernameInput formData={formData} setFormData={setFormData} />
  );
};

/**
 * SignupEmailInput
 */
const SignupEmailInput = ({ formData, setFormData }) => {
  return (
    <ValidatingEmailInput
      formData={formData}
      setFormData={setFormData}
      successMessage="Email is available"
    />
  );
};

/**
 * SignupPasswordInput
 */
const SignupPasswordInput = ({ formData, setFormData }) => {
  return (
    <ValidatingPasswordInput formData={formData} setFormData={setFormData} />
  );
};

/**
 * SignupNewOrganizationNameInput
 */
const SignupNewOrganizationNameInput = ({ formData, setFormData }) => {
  return (
    <ValidatingOrganizationNameInput
      formData={formData}
      setFormData={setFormData}
    />
  );
};

/**
 * SignupExistingOrganizationNameInput
 */
const SignupExistingOrganizationNameInput = ({
  formData,
  setFormData,
  organizationOptions,
}) => {
  return (
    <>
      <ValidatingFormTextDropdownInput
        formKey="organizationName"
        placeholder="Organization Name"
        formData={formData}
        setFormData={setFormData}
        options={organizationOptions}
      />
    </>
  );
};

/**
 * SignupExistingOrganizationNameInput
 */
const SignupNewOrganizationTypeInput = ({
  formData,
  setFormData,
  organizationTypeOptions,
}) => {
  return (
    <>
      <ValidatingFormTextDropdownInput
        formKey="organizationType"
        placeholder="Organization Type"
        formData={formData}
        setFormData={setFormData}
        options={organizationTypeOptions}
      />
    </>
  );
};

/**
 * SignupForm
 */
export const SignupForm = ({
  children,
  headerMessageTitle,
  headerMessageDescription,
  onSubmit,
}) => {
  return (
    <EntryTextForm
      title="Welcome to Docupaxx!"
      headerMessageTitle={headerMessageTitle}
      headerMessageDescription={headerMessageDescription}
      onSubmit={onSubmit}
      submitButtonText="Sign Up"
      footerChildren={
        <>
          Already signed up?&nbsp;<a href="./login">Login here</a>&nbsp;instead.
        </>
      }
    >
      {children}
      <p>By signing up you agree to the <Link to="/terms">Terms and Services</Link></p>
    </EntryTextForm>
  );
};

/**
 * signupAction
 */
export const signupAction = ({
  formData,
  organizationExists = false,
  history,
}) => {
  if (!isValidatedFormData(formData)) {
    alert("One of more forms is filled out incorrectly");
    return;
  }
  const {
    username,
    email,
    password,
    organizationName,
    organizationType,
  } = getValueMap(formData);
  if (organizationName && organizationExists) {
    createOrganizationalMember(
      username,
      email,
      password,
      organizationName,
      history
    );
    return;
  }
  if (organizationName && !organizationExists) {
    createOrganizationalLead(
      username,
      email,
      password,
      organizationName,
      organizationType,
      history
    );
    return;
  }
  createPersonalUser(username, email, password, history);
};

/**
 * createPersonalUser
 */
const createPersonalUser = (username, email, password, history) => {
  return createUser({ username, email, password, type: "iUser" }).then(() =>
    redirectToLogin(history)
  );
};

/**
 * createOrganizationalMember
 */
const createOrganizationalMember = (
  username,
  email,
  password,
  organizationName,
  history
) => {
  getCurrentOrganizations()
    .then((currentOrganizations) => {
      console.log(currentOrganizations, "current");
      const filteredOrganizations = currentOrganizations.filter(
        (org) => org.name === organizationName
      );
      console.log(filteredOrganizations, "filtered");
      createOrgMember({
        username,
        email,
        password,
        memberType: "orgMember",
        organizationId: filteredOrganizations[0].id,
      });
    })
    .then(() => redirectToLogin(history));
};

/**
 * createOrganizationalLead
 */
const createOrganizationalLead = (
  username,
  email,
  password,
  organizationName,
  organizationType,
  history
) => {
  createOrganization({ organizationName, organizationType })
    .then((organization) => {
      // Checks if Organization currently name exists => name is unique so this will never have values
      // const filteredOrganizations = currentOrganizations.filter((org) => org.name == organizationName)

      // if (Array.isArray(filteredOrganizations) && filteredOrganizations.length) {
      //     createUser({ username, email, password, type: "orgLead", organizationId: filteredOrganizations[0].id })
      // }
      //alert(JSON.stringify(organization));
      createOrgLead({
        username,
        email,
        password,
        organizationId: organization.id,
        memberType: "orgLead",
      });
    })
    .then(() => redirectToLogin(history));
};

/**
 * createUser
 */
const createUser = (props) => {
  return request(`/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...props,
      name: props.username,
      email: props.email,
      password: props.password,
      registrationDate: "April 3, 2021",
      type: props.type,
      is_enabled: (props.type == "iUser" || props.type == "orgMember" ? 0: 1)
    }),
  });
};

/**
 * createOrgLead
 */
const createOrgLead = (props) => {
  return request(
    `/organizations/${props.organizationId}/users/${props.memberType}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...props,
        name: props.username,
        email: props.email,
        password: props.password,
        registrationDate: "April 3, 2021",
      }),
    }
  );
};
const createOrgMember = (props) => {
  return request(
    `/organizations/${props.organizationId}/users/${props.memberType}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...props,
        name: props.username,
        email: props.email,
        password: props.password,
        registrationDate: "April 3, 2021",
      }),
    }
  );
};

/**
 * createOrganization
 */
const createOrganization = ({ organizationName, organizationType }) => {
  return request("/organizations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: organizationName,
      type: organizationType,
      description: "This organizations is known as " + organizationName + ".",
      approved: 0,
    }),
  });
};

/**
 * getCurrentOrganizations
 */
const getCurrentOrganizations = () => {
  return request("/organizations/search");
};

/**
 * redirectToLogin
 */
const redirectToLogin = (history) => {
  request("/sessions/1", {
    method: "PATCH",
    mock: true,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "signedOut",
      user: null,
      dashboardToken: "",
      messageHeader: "Congratulations!",
      message: "You've successfully created an account!",
      status: "",
      count: "",
    }),
  }).then(() => history.push("/login"));
};

const loadOrganizationOptions = (
  setOrganizationsOptions,
  firstLoad,
  setFirstLoad
) => {
  if (!firstLoad) {
    return;
  }
  request("/organizations/names").then((names) => {
    const orgnaizationOptions = names.map((name) => {
      return { key: name, text: name, value: name };
    });
    setOrganizationsOptions(orgnaizationOptions);
    setFirstLoad(false);
  });
};

const loadOrganizationTypeOptions = (
  setOrganizationTypeOptions,
  firstLoad,
  setFirstLoad
) => {
  if (!firstLoad) {
    return;
  }
  request("/organizations/types").then((types) => {
    const organizationLeadOptions = types
      .filter((type) => isVisibleString(type))
      .map((type) => {
        return { key: type, text: type, value: type };
      });
    setOrganizationTypeOptions(organizationLeadOptions);
    setFirstLoad(false);
  });
};
