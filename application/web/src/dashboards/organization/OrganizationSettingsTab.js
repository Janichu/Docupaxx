import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Form, Grid, Header, Icon, Image } from "semantic-ui-react";
import { ORGANIZATION_MODEL } from "../../common/dashboard/dataitem/organization/OrganizationsTab";
import { SettingsTab } from "../../common/dashboard/SettingsTab";
import {
  cloneFormDataWithNewValue,
  makeFormData,
} from "../../common/form/FormData";
import { ValidatingFormTextAreaInput } from "../../common/form/input/ValidatingFormTextAreaInput";
import { ValidatingFormTextFieldInput } from "../../common/form/input/ValidatingFormTextFieldInput";
import { requestEncodedUrl } from "../../util/fileUtils";
import { request } from "../../util/request";

/**
 * OrganizationSettingsTab
 */
export const OrganizationSettingsTab = () => {
  // Attributes for organization
  const [org, setOrg] = useState(null);
  const [orgThumbnail, setOrgThumbnail] = useState("");
  const [formData, setFormData] = useState(
    makeFormData(["organizationDescription", "organizationImage"])
  );
  const [saved, setSaved] = useState(false);

  // Viewer Id
  const { id } = useParams();

  // Patches an organization when finished
  const save = () => updateOrganization(id, org, formData, setSaved);

  // Loads an organization upon render
  useEffect(
    () =>
      loadOrganization(
        id,
        formData,
        setOrg,
        setOrgThumbnail,
        setFormData,
        setSaved
      ),
    [id]
  );

  // Organization Settings Form
  return (
    <SettingsTab
      settingSubject={"Organization"}
      iconName={ORGANIZATION_MODEL.iconName}
    >
      <Form onSubmit={save}>
        {/* Area that shows the organization's thumbnail */}
        {orgThumbnail && <Image width="5%" src={orgThumbnail} />}

        {/* Shows Organization Description */}
        <OrganizationDescriptionInput
          formData={formData}
          setFormData={updateSaved(setFormData, setSaved)}
        />

        {/* Button to upload an Organization Image */}
        <OrganizationImageInput
          org={org}
          formData={formData}
          setFormData={updateSaved(setFormData, setSaved)}
        />

        {/* Save Button */}
        {saved ? (
          <Button color="gray" disabled>
            Save
          </Button>
        ) : (
          <Button color="blue" type="submit">
            Save
          </Button>
        )}
      </Form>
    </SettingsTab>
  );
};

/**
 *  OrganizationEmailInput
 */
const OrganizationEmailInput = ({ formData, setFormData }) => {
  return (
    <ValidatingFormTextFieldInput
      formKey={"organizationEmail"}
      validating={false}
      required={false}
      formData={formData}
      setFormData={setFormData}
    />
  );
};

/**
 * OrganizationAddressInput
 */
const OrganizationAddressInput = ({ formData, setFormData }) => {
  return (
    <ValidatingFormTextFieldInput
      formKey={"organizationAddress"}
      validating={false}
      required={false}
      formData={formData}
      setFormData={setFormData}
    />
  );
};

/**
 * OrganizationDescriptionInput
 */
const OrganizationDescriptionInput = ({ formData, setFormData }) => {
  return (
    <ValidatingFormTextAreaInput
      formKey="organizationDescription"
      placeholder="Organization Description"
      formData={formData}
      setFormData={setFormData}
    />
  );
};

const OrganizationImageInput = ({ org, formData, setFormData }) => {
  const imageFile = formData["organizationImage"].value;
  const imageFileHasName =
    imageFile.name && imageFile.name.trim() !== "(Empty)";
  return (
    <Form.Field>
      <label>Image for your organization </label>
      <Grid>
        <Grid.Row>
          <Button
            as="label"
            htmlFor="file"
            type="button"
            style={{
              width: "97%",
              height: "150px",
              marginLeft: "14px",
              marginTop: "10px",
            }}
            content={
              <>
                <Icon
                  name="image outline"
                  size="huge"
                  style={{ paddingTop: "25px" }}
                />
                <Header
                  as="h3"
                  style={{ marginLeft: "-40px", marginTop: "45px" }}
                >
                  {imageFileHasName ? imageFile.name : "Upload File"}
                </Header>
              </>
            }
          />
          <input
            type="file"
            id="file"
            hidden
            onChange={(e) => updateImage(e, formData, setFormData)}
          />
        </Grid.Row>
      </Grid>
    </Form.Field>
  );
};

const updateImage = (e, formData, setFormData) => {
  if (e.target.files[0]) {
    const file = e.target.files[0];
    setFormData(cloneFormDataWithNewValue(formData, "organizationImage", file));
  } else {
    alert("No image selected");
  }
};

/**
 * loadOrganization
 */
const loadOrganization = (
  id,
  formData,
  setOrg,
  setOrgThumbnail,
  setFormData,
  setSaved
) => {
  request(`/organizations/${id}`)
    .then((org) => {
      const formDataWithDescription = cloneFormDataWithNewValue(
        formData,
        "organizationDescription",
        org.description
      );
      setFormData(formDataWithDescription);
      setOrg(org);
      setSaved(true);
      return requestEncodedUrl(org.thumbnail);
    })
    .then((encodedUrl) => {
      setOrgThumbnail(encodedUrl);
    });
};

/**
 * updateOrganization
 */
const updateOrganization = (id, org, formData, setSaved) => {
  const orgImage = formData["organizationImage"].value;
  const fetchFormData = new FormData();
  fetchFormData.append("image", orgImage);
  fetchFormData.append(
    "description",
    formData["organizationDescription"].value
  );
  request(`/organizations/${id}`, {
    method: "PATCH",
    body: fetchFormData,
  }).then(() => setSaved(true));
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
