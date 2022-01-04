import { useParams } from "react-router-dom";
import { DashboardModel, DashboardPage } from "../../common/dashboard/DashboardPage";
import { OrganizationDashboardMenuItems } from "./OrganizationDashboardMenuItems";
import { OrganizationDashboardRoutes } from "./OrganizationDashboardRoutes";

/**
 * ORGANIZATION_DASHBOARD_MODEL
 */
const ORGANIZATION_DASHBOARD_MODEL = DashboardModel({
    dashboardToken: "organizations"
})



/**
 * OrganizationDashboardPage
 */
export const OrganizationDashboardPage = () => {
    const { id } = useParams()
    const dashboardToken = ORGANIZATION_DASHBOARD_MODEL.dashboardToken
    const menuItemList = OrganizationDashboardMenuItems()
    const routeList = OrganizationDashboardRoutes(dashboardToken)
    return (
        <DashboardPage
            viewerId={id}
            dashboardToken={dashboardToken}
            menuItemList={menuItemList}
            routeList={routeList}
        />
    )
}