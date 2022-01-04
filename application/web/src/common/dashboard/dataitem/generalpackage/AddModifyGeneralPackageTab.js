import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { request } from "../../../../util/request";
import {
  cloneFormDataWithNewValue,
  makeFormData,
} from "../../../form/FormData";
import {
  alphanumericMandatoryStringRequirements,
  stringCantBeEmptyRequirement,
} from "../../../form/input/FrontendValidationRequirements";
import { ValidatingFormTextAreaInput } from "../../../form/input/ValidatingFormTextAreaInput";
import { ValidatingFormTextFieldInput } from "../../../form/input/ValidatingFormTextFieldInput";
import { DataAddModifyTab } from "../../DataTab";

/**
 * AddModifyGeneralPackageTab
 */
export const AddModifyGeneralPackageTab = ({
  viewerId,
  packageId,
  titleText,
  dataModel,
  iconContent,
  loadPackage,
  savePackage,
}) => {
  const [formData, setFormData] = useState(
    makeFormData(["packageName", "packageDescription"])
  );
  const [paxx, setPaxx] = useState(null);
  useEffect(
    () => loadPackage({ viewerId, packageId, paxx, setPaxx, dataModel }),
    [viewerId, packageId]
  );
  useEffect(() => {
    loadPackageFields(paxx, formData, setFormData);
  }, [paxx]);
  return (
    <DataAddModifyTab
      titleText={titleText}
      iconContent={iconContent}
      onSave={() =>
        savePackage({ viewerId, packageId, dataModel, paxx, formData })
      }
    >
      <AddModifyGeneralPackageNameInput
        formData={formData}
        setFormData={setFormData}
      />
      <AddModifyGeneralPackageDescriptionInput
        formData={formData}
        setFormData={setFormData}
      />
      <Link to={`/${dataModel.dashboardToken}/${viewerId}/dashboard/${dataModel.childDataToken}/${packageId}`} >View Items</Link>
      <br></br>
      <br></br>
      <Button type="submit" color="blue">
        Save
      </Button>
    </DataAddModifyTab>
  );
};

/**
 * loadExistingPackage
 */
export const loadExistingPackage = ({
  viewerId,
  packageId,
  setPaxx,
  dataModel,
}) => {
  request(
    `/${dataModel.dashboardToken}/${viewerId}/${dataModel.dataToken}/${packageId}`
  )
    .then((pkg) => {
      setPaxx(pkg);
    })
    .catch((error) => alert("Error: " + JSON.stringify(error)));
};

/**
 * loadNewPackage
 */
export const loadNewPackage = ({ paxx, setPaxx }) => {
  if (paxx == null) {
    setPaxx({
      name: "",
      description: "",
    });
  }
};

/**
 * saveExistingPackage
 */
export const saveExistingPackage = (savePackageParams) => {
  const dataModel = savePackageParams.dataModel;
  savePackage({
    ...savePackageParams,
    fetchUrl: `/${dataModel.dashboardToken}/${savePackageParams.viewerId}/${dataModel.dataToken}/${savePackageParams.packageId}`,
    fetchMethod: "PATCH",
    dataModel,
  });
};

/**
 * saveNewPackage
 */
export const saveNewPackage = (savePackageParams) => {
  const dataModel = savePackageParams.dataModel;
  savePackage({
    ...savePackageParams,
    fetchUrl: `/${dataModel.dashboardToken}/${savePackageParams.viewerId}/${dataModel.dataToken}`,
    fetchMethod: "POST",
    dataModel,
  });
};

/**
 * AddModifyGeneralPackageNameInput
 */
const AddModifyGeneralPackageNameInput = ({ formData, setFormData }) => {
  return (
    <ValidatingFormTextFieldInput
      formKey="packageName"
      validating={true}
      frontendValidationRequirements={stringCantBeEmptyRequirement}
      formData={formData}
      setFormData={setFormData}
      required={false}
    />
  );
};

/**
 * AddModifyGeneralPackageDescriptionInput
 */
const AddModifyGeneralPackageDescriptionInput = ({ formData, setFormData }) => {
  return (
    <ValidatingFormTextAreaInput
      formKey="packageDescription"
      formData={formData}
      setFormData={setFormData}
    />
  );
};

/**
 * loadPackageFields
 */
const loadPackageFields = (paxx, formData, setFormData) => {
  if (paxx) {
    const formDataWithName = cloneFormDataWithNewValue(
      formData,
      "packageName",
      paxx.name
    );
    const formDataWithDescription = cloneFormDataWithNewValue(
      formDataWithName,
      "packageDescription",
      paxx.description
    );
    setFormData(formDataWithDescription);
  }
};

/**
 * savePackage
 */
const savePackage = ({
  viewerId,
  formData,
  fetchUrl,
  fetchMethod,
  dataModel,
}) => {
  const packageName = formData["packageName"].value;
  const packageDescription = formData["packageDescription"].value;
  requestSavePackage(
    fetchUrl,
    fetchMethod,
    packageName,
    packageDescription
  ).then(() =>
    window.location.replace(
      `/${dataModel.dashboardToken}/${viewerId}/dashboard/${dataModel.dataToken}`
    )
  );
};

const requestSavePackage = (
  fetchUrl,
  fetchMethod,
  packageName,
  packageDescription
) => {
  return request(fetchUrl, {
    method: fetchMethod,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: packageName,
      description: packageDescription,
    }),
  });
};
