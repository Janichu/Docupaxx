import { useContext, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { Message, PopupHeader } from "semantic-ui-react";
import { DocupaxxPage } from "../common/DocupaxxPage";
import { EntryTextForm } from "../common/form/entryform/EntryTextForm";
import { getValueMap, makeFormData } from "../common/form/FormData";
import {
  ValidatingEmailInput,
  ValidatingPasswordInput,
} from "../common/form/input/ValidatingFormTextFieldInput";
import { SessionContext } from "../common/session/SessionContextManager";
import { request } from "../util/request";

/**
 * USER_TYPE_DASHBOARD_TOKEN_MAP
 */
const USER_TYPE_DASHBOARD_TOKEN_MAP = {
  signedOut: "",
  iUser: "users",
  orgMember: "organizations",
  orgLead: "organizations",
  admin: "admins",
};

/**
 * LoginPage
 */
export const LoginPage = () => {
  const [formData, setFormData] = useState(makeFormData(["email", "password"]));
  const session = useContext(SessionContext);
  const history = useHistory();

  return (
    <DocupaxxPage>
      {session && session.messageHeader && session.messageHeader.length > 0 && (
        <LoginFormStatusMessage
          messageHeader={session.messageHeader}
          message={session.message}
        />
      )}
      <LoginForm onSubmit={() => loginAction(formData, history)}>
        <LoginEmailInput formData={formData} setFormData={setFormData} />
        <LoginPasswordInput formData={formData} setFormData={setFormData} />
      </LoginForm>
    </DocupaxxPage>
  );
};

/**
 * LoginEmailInput
 */
const LoginEmailInput = ({ formData, setFormData }) => {
  return (
    <ValidatingEmailInput
      formKey="email"
      validating={false}
      icon="user"
      iconPosition="left"
      formData={formData}
      setFormData={setFormData}
      required={false}
      successMessage="Email is valid"
    />
  );
};

/**
 * LoginPasswordInput
 */
const LoginPasswordInput = ({ formData, setFormData }) => {
  return (
    <ValidatingPasswordInput
      formKey="password"
      validating={false}
      icon="lock"
      iconPosition="left"
      password
      formData={formData}
      setFormData={setFormData}
      required={false}
    />
  );
};

/**
 * LoginForm
 */
const LoginForm = ({ children, onSubmit }) => {
  return (
    <EntryTextForm
      title="Welcome to Docupaxx!"
      headerMessageTitle="Login to your account"
      headerMessageDescription="Fill out the form below to login into your account."
      onSubmit={onSubmit}
      submitButtonText="Log In"
      footerChildren={
        <>
          Don't have an account? <a href="/getstarted">Sign Up here</a> instead.
        </>
      }
    >
      {children}
    </EntryTextForm>
  );
};

/**
 * LoginFormStatusMessage
 */
const LoginFormStatusMessage = ({ messageHeader, message }) => {
  const [visible, setVisible] = useState(true);
  return (
    <>
      {visible && (
        <PopupHeader>
          <Message
            onDismiss={() => {
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
                  messageHeader: "",
                  message: "",
                  status: "",
                  count: "",
                }),
              }).then(() => setVisible(false));
            }}
            success
            header={messageHeader}
            content={message}
          />
        </PopupHeader>
      )}
    </>
  );
};

/**
 * loginAction
 */
const loginAction = (formData, history) => {
  const { email, password } = getValueMap(formData);
  request(`/users/login?email=${email}&password=${password}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  })
    .then((users) => {
      // alert("Logged In User: " + JSON.stringify(users));
      const user = users[0];
      user.name = user.username;
      user.extension.organizationId = user.extension.organization_id;
      console.log(user, "user");
      if (!user) {
        return loginFail();
      }
      loadNewSession(user, history);
    })
    .catch((error) => alert("Incorrect email and/or password"));
};

/**
 * loginFail
 */
const loginFail = () => {
  alert("Incorrect email and/or password");
};

/**
 * findMatchingUser
 */
// const findMatchingUser = (users, enteredEmail, enteredPassword) => {
//   const emailFilteredUsers = users.filter((user) => user.email === enteredEmail);
//     if (emailFilteredUsers.length === 0) {
//       console.log("e-fail");
//       return null
//     }
//     const passFilteredUsers = emailFilteredUsers.filter((user) => user.password === enteredPassword);
//     if (passFilteredUsers.length === 0) {
//       console.log("p-fail");
//       return null
//     }
//     return passFilteredUsers[0]
// }

/**
 * loadUserSession
 */
const loadNewSession = async (user, history) => {
  request("/sessions/1", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: user.type,
      user: user,
      organizationId: user.organization_id,
      dashboardToken: USER_TYPE_DASHBOARD_TOKEN_MAP[user.type],
      message: "",
      status: "",
      count: "",
    }),
  }).then(() => {
    history.push("/home");
    window.location.reload();
  });
};
