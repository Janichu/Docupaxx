import { useParams } from "react-router-dom";
import {
  DashboardModel,
  DashboardPage,
} from "../../common/dashboard/DashboardPage";
import { UserDashboardMenuItems } from "./UserDashboardMenuItems";
import { UserDashboardRoutes } from "./UserDashboardRoutes";

/**
 * USER_DASHBOARD_MODEL
 */
export const USER_DASHBOARD_MODEL = DashboardModel({
  dashboardToken: "users",
});

/**
 * UserDashboardPage
 */
export const UserDashboardPage = () => {
  const { id } = useParams();
  const dashboardToken = USER_DASHBOARD_MODEL.dashboardToken;
  const menuItemList = UserDashboardMenuItems();
  const routeList = UserDashboardRoutes(dashboardToken);
  return (
    <DashboardPage
      viewerId={id}
      dashboardToken={dashboardToken}
      menuItemList={menuItemList}
      routeList={routeList}
    />
  );
};
