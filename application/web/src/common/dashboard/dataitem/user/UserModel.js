import { DataItemModel } from "../DataItemModel";
import { GENERAL_USER_MODEL } from "../generaluser/GeneralUsersTab";
import { USER_MODEL } from "./UsersTab";

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

/*
add: true,
edit: true,
download: false,
remove: true,
*/
