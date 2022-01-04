import { useParams } from "react-router-dom";
import { DashboardModel, DashboardPage } from "../../common/dashboard/DashboardPage";
import { AdminDashboardMenuItems } from "./AdminDashboardMenuItems";
import { AdminDashboardRoutes } from "./AdminDashboardRoutes";

/**
 * ADMIN_DASHBOARD_MODEL
 */
const ADMIN_DASHBOARD_MODEL = DashboardModel({
    dashboardToken: "admins"
})



/**
 * AdminDashboardPage
 */
export const AdminDashboardPage = () => {
    const { id } = useParams()
    const dashboardToken = ADMIN_DASHBOARD_MODEL.dashboardToken
    const menuItemList = AdminDashboardMenuItems()
    const routeList = AdminDashboardRoutes(dashboardToken)
    return (
        <DashboardPage
            viewerId={id}
            dashboardToken={dashboardToken}
            menuItemList={menuItemList}
            routeList={routeList}
        />
    )
}