import { useParams } from "react-router-dom";
import { DataItemModel } from "../../common/dashboard/dataitem/DataItemModel";
import { ORGANIZATION_MODEL, OrganizationsTab } from "../../common/dashboard/dataitem/organization/OrganizationsTab";

/**
 * ADMIN_UNAPPROVED_ORGANIZATION_MODEL
 */
const ADMIN_UNAPPROVED_ORGANIZATION_MODEL = DataItemModel({
    ...ORGANIZATION_MODEL,
    dashboardToken: "admins",
    section: "unapprovedOrganizations",
    approve: true,
    filterDataItems: (items) => items.filter((item) => item.is_approved != 1)
})



/**
 * AdminUnapprovedOrganizationsTab
 */
export const AdminUnapprovedOrganizationsTab = () => {
    const { id } = useParams()
    return (
        <OrganizationsTab
            viewerId={id}
            dataModel={ADMIN_UNAPPROVED_ORGANIZATION_MODEL}
        />
    )
}