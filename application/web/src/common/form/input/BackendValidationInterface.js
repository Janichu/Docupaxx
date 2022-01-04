import { request } from "../../../util/request";

// function to validate the user's username is valid.
export const backendUsernameValidationActions = () => {
    const usernameValidationAction = (username) => {
        return new Promise((resolve, reject) => {
            request(`/users/getbyusername?username=${username}`) // calling to the backend.
                .then((users) => {
                    if (users.length > 0) { // if the user list is > 0, then the user name is already taken.
                        reject([{message: "Username is already taken."}]);
                        return
                    }
                    resolve([{message: "Username is available!"}]); // otherwise, the username is available.
                });
        });
    };
    return [usernameValidationAction] // returning a list of functions of usernameValidationAction because the backend validation actions requires a list of actions.
};

// function to validate the organization's name is valid.
export const backendOrganizationNameValidationActions = () => {
    const organizationValidationAction = (organizationName) => {
        return new Promise((resolve, reject) => {
            request(`/organizations/getbyorganizationname?organizationName=${organizationName}`) // calling to the backend.
                .then((organizations) => {
                    if (organizations.length > 0) { // if the organization list is > 0, then the organization name is already taken.
                        reject([{message: "Organization name is already taken."}]);
                        return
                    }
                    resolve([{message: "Organization name is available!"}]); // otherwise, the organization name is available.
                });
        });
    };
    return [organizationValidationAction] // returning a list of functions of organizationValidationAction because the backend validation actions requires a list of actions. 
                                          // only one action for organization name.  
};