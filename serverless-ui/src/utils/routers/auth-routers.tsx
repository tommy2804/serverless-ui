import { Routes, Route, Navigate } from "react-router-dom";
import { lazy } from "react";
import Suspensor from "../../shared/suspense";

const SignUp = lazy(() => import("../../pages/auth/modules/sign-up/sign-up"));
const VerifyEmail = lazy(() => import("../../pages/auth/modules/verify-email/verify-email"));
const SignIn = lazy(() => import("../../pages/auth/modules/sign-in/sign-in"));
const ForgotPassword = lazy(
  () => import("../../pages/auth/modules/forgot-password/forgot-password")
);
const ChangePassword = lazy(
  () => import("../../pages/auth/modules/change-password/change-password")
);

interface AuthRoutersProps {
  lastUrl?: string;
}

const AuthRouters = ({ lastUrl }: AuthRoutersProps) => (
  <Routes>
    <Route
      path='/sign-up'
      element={
        <Suspensor>
          <SignUp />
        </Suspensor>
      }
    />
    <Route
      path='/sign-in'
      element={
        <Suspensor>
          <SignIn />
        </Suspensor>
      }
    />
    <Route
      path='/forgot-password'
      element={
        <Suspensor>
          <ForgotPassword />
        </Suspensor>
      }
    />
    <Route
      path='/verify-email'
      element={
        <Suspensor>
          <VerifyEmail />
        </Suspensor>
      }
    />
    <Route
      path='/change-password'
      element={
        <Suspensor>
          <ChangePassword />
        </Suspensor>
      }
    />
    <Route
      path='*'
      element={<Navigate to='/sign-in' state={{ prevUrl: lastUrl }} replace={true} />}
    />
  </Routes>
);

export default AuthRouters;
