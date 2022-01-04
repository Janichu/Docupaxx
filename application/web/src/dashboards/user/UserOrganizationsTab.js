import { useParams } from "react-router-dom";
import { DataItemModel } from "../../common/dashboard/dataitem/DataItemModel";
import { ORGANIZATION_MODEL, OrganizationsTab } from "../../common/dashboard/dataitem/organization/OrganizationsTab";

/**
 * USER_ORGANIZATION_MODEL
 */
const USER_ORGANIZATION_MODEL = DataItemModel({
    ...ORGANIZATION_MODEL,
    dashboardToken: "users"
})



/**
 * UserOrganizationsTab
 */
export const UserOrganizationsTab = () => {
    const { id } = useParams()
    return (
        <OrganizationsTab
            viewerId={id}
            dataModel={USER_ORGANIZATION_MODEL}
        />
    )
}