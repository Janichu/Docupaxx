import { useParams } from "react-router-dom";
import { DataItemModel } from "../../common/dashboard/dataitem/DataItemModel";
import { USER_MODEL, UsersTab } from "../../common/dashboard/dataitem/user/UsersTab";

/**
 * ADMIN_USER_MODEL
 */
const ADMIN_USER_MODEL = DataItemModel({
    ...USER_MODEL,
    dashboardToken: "admins",
    remove: true,
    removalText: "Remove User"
})



/**
 * AdminUsersTab
 */
export const AdminUsersTab = () => {
    const { id } = useParams()
    return (
        <UsersTab
            viewerId={id}
            dataModel={ADMIN_USER_MODEL}
        />
    )
}