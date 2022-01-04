import {
  UserAddDocumentTab,
  UserDocumentsTab,
  UserEditDocumentTab,
} from "./UserDocumentsTab";
import { UserOrganizationsTab } from "./UserOrganizationsTab";
import {
  UserAddPackageTab,
  UserEditPackageTab,
  UserPackagesTab,
} from "./UserPackagesTab";
import { UserQuizTab } from "./UserQuizTab";
import { UserSendPackageTab, UserSentPackagesTab } from "./UserSentPackagesTab";
import { UserSettingsTab } from "./UserSettingsTab";

/**
 * UserDashboardRoutes
 */
export const UserDashboardRoutes = (dashboardToken) => [
  {
    path: `/${dashboardToken}/:id/dashboard/packages`,
    component: UserPackagesTab,
  },
  {
    path: `/${dashboardToken}/:id/dashboard/packages/:packageId/edit`,
    component: UserEditPackageTab,
  },
  {
    path: `/${dashboardToken}/:id/dashboard/packages/new`,
    component: UserAddPackageTab,
  },
  {
    path: `/${dashboardToken}/:id/dashboard/documents/:packageId`,
    component: UserDocumentsTab,
  },
  {
    path: `/${dashboardToken}/:id/dashboard/documents/:packageId/:documentId/edit`,
    component: UserEditDocumentTab,
  },
  {
    path: `/${dashboardToken}/:id/dashboard/documents/:packageId/new`,
    component: UserAddDocumentTab,
  },
  {
    path: `/${dashboardToken}/:id/dashboard/organizations`,
    component: UserOrganizationsTab,
  },
  {
    path: `/${dashboardToken}/:id/dashboard/sentPackages`,
    component: UserSentPackagesTab,
  },
  {
    path: `/${dashboardToken}/:id/dashboard/sentPackages/new`,
    component: UserSendPackageTab,
  },
  {
    path: `/${dashboardToken}/:id/dashboard/quiz`,
    component: UserQuizTab,
  },
  {
    path: `/${dashboardToken}/:id/dashboard/settings`,
    component: UserSettingsTab,
  },
];
