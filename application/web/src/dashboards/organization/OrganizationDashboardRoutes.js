import {
  OrganizationAddArpTab,
  OrganizationArpsTab,
  OrganizationEditArpTab,
} from "./OrganizationArpsTab";
import {
  OrganizationAddArTab,
  OrganizationArsTab,
  OrganizationEditArTab,
} from "./OrganizationArsTab";
import {
  OrganizationInviteMembersTab,
  OrganizationMembersTab,
} from "./OrganizationMembersTab";
import { OrganizationReceivedDocumentsTab } from "./OrganizationReceivedDocumentsTab";
import { OrganizationReceivedPackagesTab } from "./OrganizationReceivedPackagesTab";
import { OrganizationSettingsTab } from "./OrganizationSettingsTab";

/**
 * OrganizationDashboardRoutes
 */
export const OrganizationDashboardRoutes = (dashboardToken) => [
  {
    path: `/${dashboardToken}/:id/dashboard/members`,
    component: OrganizationMembersTab,
  },
  {
    path: `/${dashboardToken}/:id/dashboard/members/new`,
    component: OrganizationInviteMembersTab,
  },
  {
    path: `/${dashboardToken}/:id/dashboard/arps`,
    component: OrganizationArpsTab,
  },
  {
    path: `/${dashboardToken}/:id/dashboard/arps/new`,
    component: OrganizationAddArpTab,
  },
  {
    path: `/${dashboardToken}/:id/dashboard/arps/:arpId/edit`,
    component: OrganizationEditArpTab,
  },
  {
    path: `/${dashboardToken}/:id/dashboard/ars/:arpId`,
    component: OrganizationArsTab,
  },
  {
    path: `/${dashboardToken}/:id/dashboard/ars/:arpId/:arId/edit`,
    component: OrganizationEditArTab,
  },
  {
    path: `/${dashboardToken}/:id/dashboard/ars/:arpId/new`,
    component: OrganizationAddArTab,
  },
  {
    path: `/${dashboardToken}/:id/dashboard/receivedPackages`,
    component: OrganizationReceivedPackagesTab,
  },
  {
    path: `/${dashboardToken}/:id/dashboard/sentDocuments/:sentPackageId`,
    component: OrganizationReceivedDocumentsTab,
  },
  {
    path: `/${dashboardToken}/:id/dashboard/settings`,
    component: OrganizationSettingsTab,
  },
];
