import { useEffect, useState } from "react";
import { Button, Form, Header, Icon, Modal } from "semantic-ui-react";
import { request } from "../../../../util/request";
import { cloneFormDataWithNewValue, makeFormData } from "../../../form/FormData";
import { DataAddModifyTab } from "../../DataTab";
import { DataItemIconContent } from "../DataItemIconContent";


/**
 * INITIAL_FIELDS
 */
const INITIAL_FIELDS = { 
    "packages": { value: [], success: true, messageList: [] },
    "organizations": { value: [], success: true, messageList: [] },
}



/**
 * SendPackageTab
 */
export const SendPackageTab = ({ viewerId, dataModel }) => {
    const [formData, setFormData] = useState(makeFormData(["packages", "organizations", "package", "organization"], INITIAL_FIELDS))
    useEffect(() => loadOrganizations(formData, setFormData), []);
    useEffect(() => loadPackages(formData, setFormData, viewerId), [viewerId]);
    return (
        <DataAddModifyTab
            titleText={"Send a Package"}
            iconContent={<DataItemIconContent dataModel={dataModel} existing={false}/>}
            onSave={() => {alert("Go")}}
        >
            <Form>
                <PackagesSelector formData={formData} setFormData={setFormData} />
                <OrganizationsSelector formData={formData} setFormData={setFormData} />
                <SendPackageModal packageId={getPackageId(formData)} onConfirm={() => sendPackage({ packageId: getPackageId(formData), viewerId, dataModel, formData })} />
            </Form>
        </DataAddModifyTab>
    )
}



/**
 * PackagesSelector
 */
const PackagesSelector = ({ formData, setFormData }) => {
    return (
        <ItemSelector
            formKey="package"
            title="My Packages"
            placeholder="Select a Package"
            formData={formData}
            setFormData={setFormData}
        />
    )
}



/**
 * OrganizationsSelector
 */
const OrganizationsSelector = ({ formData, setFormData }) => {
    return (
        <ItemSelector
            formKey="organization"
            title="Organizations"
            placeholder="Select an Organization"
            formData={formData}
            setFormData={setFormData}
        />
    )
}



/**
 * ItemSelector
 */
const ItemSelector = ({ formKey, title, placeholder, formData, setFormData}) => {
    const setItem = makeSetItemFunction(formData, setFormData, formKey)
    return (
        <Form.Select
            fluid
            label={title}
            options={formData[formKey + "s"].value}
            onChange={(e, { options, value }) => {
                setItem(
                    options.filter((item) => Object.values(item).includes(value))
                );
            }}
            placeholder={placeholder}
        />
    )
}



/**
 * SendPackageModal
 */
const SendPackageModal = ({ packageId, onConfirm }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
        {/*<Modal
            dimmer="inverted"
            closeIcon
            open={open}
            trigger={
                <Button content="Send a package" icon="send" labelPosition="left" color="green"/>
            }
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
        >
            <Header icon="send" content="Send a package" />
            <Modal.Content>
                <p>Are you sure about sending this package to this organization?</p>
            </Modal.Content>
            <SendPackageModalActions setOpen={setOpen} packageId={packageId} onConfirm={onConfirm} />
        </Modal>*/}
        <Button content="Send a packnage" icon="send" labelPosition="left" color="green" onClick={() => {
            onConfirm(packageId);
        }}/>
        </>
    );
};



/**
 * SendPackageModalActions
 */
const SendPackageModalActions = ({ setOpen, packageId, onConfirm }) => {
    return (
        <Modal.Actions>
            <Button
                color="green"
                onClick={() => {
                    setOpen(false);
                    onConfirm(packageId);
                }}
            >
                <Icon name="checkmark" /> Yes
            </Button>
            <Button color="red" onClick={() => setOpen(false)}>
                <Icon name="remove" /> No
            </Button>
        </Modal.Actions>
    )
}



/**
 * makeSetItemFunction
 */
const makeSetItemFunction = (formData, setFormData, formKey) => {
    return (newItem) => setFormData(cloneFormDataWithNewValue(formData, formKey, newItem))
}



/**
 * loadOrganizations
 */
const loadOrganizations = (formData, setFormData) => {
    request("/organizations/search", { mock: false }).then((organizations) => {
        setFormData(
            cloneFormDataWithNewValue(formData, "organizations", organizations.map((organization) => {
                return {
                  key: organization.id,
                  text: organization.name,
                  value: organization.name,
                };
            }))
        );
    });
}



/**
 * loadPackages
 */
const loadPackages = (formData, setFormData, viewerId) => {
    request(`/users/${viewerId}/packages`, { mock: true }).then((packages) => {
        setFormData(
            cloneFormDataWithNewValue(formData, "packages", packages.map((paxx) => {
                return {
                    key: paxx.id,
                    text: paxx.name,
                    value: paxx.name,
                    requiredDocuments: paxx.requiredDocuments,
                };
            }))
        );
    });
}



/**
 * getPackageId
 */
const getPackageId = (formData) => {
    const packageName = formData["package"].value
    const packages = formData["packages"].value
    const filteredPackages = packages.filter((pkg) => pkg.name == packageName) 
    if (filteredPackages.length == 0) {
        return 0
    }
    return filteredPackages[0].id
}



/**
 * sendPackage
 */
const sendPackage = ({ dataModel, viewerId, formData }) => {
    const packageValue = formData["package"].value
    const organizationValue = formData["organization"].value
    alert(JSON.stringify())
    request(`/${dataModel.dashboardToken}/${viewerId}/sentPackages`, {
        mock: true,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageId: packageValue[0].key,
          organizationId: organizationValue[0].key
        }),
      }).then((data)=> window.location.replace(`/users/${viewerId}/dashboard`))
}

