import { useParams } from "react-router-dom";
import { DataItemModel } from "../../common/dashboard/dataitem/DataItemModel";
import { ORGANIZATION_MODEL, OrganizationsTab } from "../../common/dashboard/dataitem/organization/OrganizationsTab";

/**
 * ADMIN_ORGANIZATION_MODEL
 */
const ADMIN_ORGANIZATION_MODEL = DataItemModel({
    ...ORGANIZATION_MODEL,
    dashboardToken: "admins",
    remove: true,
    removalText: "Remove Organization"
})



/**
 * AdminOrganizationsTab
 */
export const AdminOrganizationsTab = () => {
    const { id } = useParams()
    return (
        <OrganizationsTab
            viewerId={id}
            dataModel={ADMIN_ORGANIZATION_MODEL}
        />
    )
}