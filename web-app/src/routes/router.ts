import { createBrowserRouter } from "react-router";
import DefaultLayout from "../pages/layouts/DefaultLayout";
import PublicLayout from "../pages/layouts/PublicLayout";

import SigninForm from "../_auth/forms/SigninForm";
import SignupForm from "../_auth/forms/SignupForm";
import AuthLayout from "../_auth/AuthLayout";
import Dashboard from "../pages/home_page/Dashboard";
import ForgotPassword from "../_auth/forms/ForgotPassword";

const router = createBrowserRouter([
  {
    Component: DefaultLayout,
    children: [
      // Auth Pages
      {
        Component: AuthLayout,
        // Define routes for authentication-related pages
        children: [
          {
            path: "/signin",
            Component: SigninForm, // Replace with your login page component
          },
          {
            path: "/signup",
            Component: SignupForm, // Replace with your signup page component
          },
          {
            path: "/forgotpassword",
            Component: ForgotPassword, // Replace with your signup page component
          },
        ],
      },

      // Public Pages
      {
        Component: PublicLayout,
        children: [
          {
            path: "/dashboard",
            Component: Dashboard,
          },
        ],
      },
    ],
  },
]);

export default router;
