import { AdminOrganizationsTab } from "./AdminOrganizationsTab";
import { AdminQuizNotesTab } from "./AdminQuizNotesTab";
import { AdminAddQuestionTab, AdminEditQuestionTab, AdminQuizQuestionsTab } from "./AdminQuizQuestionsTab";
import { AdminUnapprovedOrganizationsTab } from "./AdminUnapprovedOrganizationsTab";
import { AdminUsersTab } from "./AdminUsersTab";

/**
 * AdminDashboardRoutes
 */
export const AdminDashboardRoutes = (dashboardToken) => ([
    {
      path: `/${dashboardToken}/:id/dashboard/users`,
      component: AdminUsersTab,
    },
    {
      path: `/${dashboardToken}/:id/dashboard/organizations`,
      component: AdminOrganizationsTab,
    },
    {
      path: `/${dashboardToken}/:id/dashboard/unapprovedOrganizations`,
      component: AdminUnapprovedOrganizationsTab,
    },
    {
      path: `/${dashboardToken}/:id/dashboard/quizQuestions`,
      component: AdminQuizQuestionsTab,
    },
    {
      path: `/${dashboardToken}/:id/dashboard/quizQuestions`,
      component: AdminQuizQuestionsTab,
    },
    {
      path: `/${dashboardToken}/:id/dashboard/quizQuestions/:questionId/edit`,
      component: AdminEditQuestionTab,
    },
    {
      path: `/${dashboardToken}/:id/dashboard/quizQuestions/new`,
      component: AdminAddQuestionTab,
    },
    {
      path: `/${dashboardToken}/:id/dashboard/quizNotes`,
      component: AdminQuizNotesTab,
    },
])