import { useLocation } from "react-router-dom";
import { Grid } from "@mui/material";
import { AUTH_STATE } from "../../types/auth-state";
import IzmeCircularLoading from "../../shared/loading/circular";
import AppRouters from "./app-routers";
import AuthRouters from "./auth-routers";

const Routers = ({ authState }: any): JSX.Element => {
  const location = useLocation();
  const lastUrl = [
    "sign-in",
    "sign-up",
    "change-password",
    "forgot-password",
    "verify-email",
    "mfa-verify",
    "404",
  ].some((url) => location.pathname.includes(url))
    ? "/"
    : location.pathname;

  switch (authState) {
    case AUTH_STATE.LOADING:
      return (
        <Grid container className='container'>
          <IzmeCircularLoading />
        </Grid>
      );
    case AUTH_STATE.AUTH:
      return <AppRouters prevUrl={location.state?.prevUrl} />;
    case AUTH_STATE.NOT_AUTH:
      return <AuthRouters lastUrl={lastUrl} />;
    default:
      return <AuthRouters lastUrl={lastUrl} />;
  }
};

export default Routers;
