/**
 * App
 *
 * Routes the various pages of the website
 */
import { Redirect } from "react-router";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ContactUsPage } from "./contactus/ContactUsPage";
import { ContactUsVerification } from "./contactUsVerification/ContactUsVerification";
import { AdminDashboardPage } from "./dashboards/admin/AdminDashboardPage";
import { OrganizationDashboardPage } from "./dashboards/organization/OrganizationDashboardPage";
import { UserDashboardPage } from "./dashboards/user/UserDashboardPage";
import { GetStartedPage } from "./getstarted/GetStartedPage";
import { HomePage } from "./homepage/HomePage";
import { LoginPage } from "./login/LoginPage";
import { OrganizationPackagePage } from "./organizationpage/OrganizationPackagePage";
import {
  QuizQuestionPage
} from "./quiz/QuizQuestionPage";
import {
  SignupAsOrganizationLeadPage,
  SignupAsOrganizationMemberPage,
  SignupPage,
} from "./signup/SignupPage";
import { AboutDocupaxxPage } from "./support/AboutDocupaxxPage";
import { AboutUsPage, AboutUsSinglePersonPage } from "./support/AboutUsPage";
import { FAQPage } from "./support/FAQPage";
import { FeaturesPage } from "./support/FeaturesPage";
import { TermsPage } from "./support/TermsPage";
import { TestimonialsPage } from "./support/TestimonialsPage";

import "./App.css";
import { SessionContextManager } from "./common/session/SessionContextManager";
import { VerificationPage } from "./verification/Verification";

function App() {
  return (
    <SessionContextManager>
      <BrowserRouter>
        <Switch>
          <Redirect exact from="/" to="/home" />
          <Route exact path="/home" component={HomePage} />
          <Route exact path="/features" component={FeaturesPage} />
          <Route exact path="/testimonials" component={TestimonialsPage} />
          <Route exact path="/aboutUs" component={AboutUsPage} />
          <Route exact path="/team/:name" component={AboutUsSinglePersonPage} />
          <Route exact path="/aboutDocupaxx" component={AboutDocupaxxPage} />
          <Route exact path="/faq" component={FAQPage} />
          <Route exact path="/terms" component={TermsPage} />
          <Route exact path="/verification/:id" component={VerificationPage} />
          <Route exact path="/contactUs" component={ContactUsPage} />
          <Route
            exact
            path="/verification/:userId"
            component={ContactUsVerification}
          />
          <Route exact path="/getstarted" component={GetStartedPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/signup" component={SignupPage} />
          <Route
            exact
            path="/signupOrganizationLead"
            component={SignupAsOrganizationLeadPage}
          />
          <Route
            exact
            path="/signupOrganizationMember"
            component={SignupAsOrganizationMemberPage}
          />

          <Redirect
            exact
            from="/users/:id/dashboard"
            to="/users/:id/dashboard/packages"
          />
          <Route
            path="/users/:id/dashboard/:section"
            component={UserDashboardPage}
          />
          <Redirect
            exact
            from="/organizations/:id/dashboard"
            to="/organizations/:id/dashboard/members"
          />
          <Route
            path="/organizations/:id/dashboard/:section"
            component={OrganizationDashboardPage}
          />
          <Redirect
            exact
            from="/admins/:id/dashboard"
            to="/admins/:id/dashboard/users"
          />
          <Route
            path="/admins/:id/dashboard/:section"
            component={AdminDashboardPage}
          />
          <Redirect exact from="/quiz" to="/quiz/country" />
          <Route path="/quiz/:currentUrlKey" component={QuizQuestionPage} />
          <Route
            path="/organizations/:id/requirement-packages-page"
            component={OrganizationPackagePage}
          />
        </Switch>
      </BrowserRouter>
    </SessionContextManager>
  );
}

export default App;
