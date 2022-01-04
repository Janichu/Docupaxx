import { DataItemModel } from "../DataItemModel";
import {
  GENERAL_USER_MODEL,
  GeneralUsersTab,
} from "../generaluser/GeneralUsersTab";

/**
 * USER_MODEL
 */
export const USER_MODEL = DataItemModel({
  ...GENERAL_USER_MODEL,
  title: "Users",
  section: "users",
  dataToken: "users",
  absentMessage: "No users exist yet",
});

/**
 * UsersTab
 */
export const UsersTab = ({ viewerId, dataModel }) => {
  return (
    <GeneralUsersTab
      dashboardToken={dataModel.dashboardToken}
      viewerId={viewerId}
      dataModel={dataModel}
    />
  );
};
