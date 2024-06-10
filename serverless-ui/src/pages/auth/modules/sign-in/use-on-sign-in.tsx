import { useState, useContext } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import { useToasterContext } from "../../../../state/toaster-context";
import { signIn as signInApi } from "../../../../api/auth";
import { UserStatus } from "../../../../types/user-status";
import { AUTH_STATE } from "../../../../types/auth-state";
import { CredentialsContext } from "../../context/use-credentials-context";
import { useLoginStateContext } from "../../../../state/login-context";
import { AxiosResponse } from "axios";

interface SignInResponse {
  success: boolean;
  action?: UserStatus;
  err?: any;
  session?: string;
  destination?: string;
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
  csrfToken?: string;
}
interface SignInData {
  success: boolean;
  data: SignInResponse;
  // Add other properties if needed
}

const useOnSignIn = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setToasterProps } = useToasterContext();
  const { setAuthState } = useLoginStateContext();
  const navigate = useNavigate();
  const { setCredentials } = useContext(CredentialsContext);

  const onSignIn = (username: string, password: string) => async () => {
    try {
      setIsLoading(true);
      const res: AxiosResponse = await signInApi(username, password);
      const signInData: SignInData = res.data;
      if (!signInData.success && !signInData.data?.err) {
        const action = signInData.data.action;
        if (action === UserStatus.UNCONFIRMED) {
          navigate({
            pathname: "/verify-email",
            search: createSearchParams({
              username,
            }).toString(),
          });
        } else if (action === UserStatus.FORCE_CHANGE_PASSWORD) {
          navigate({
            pathname: "/change-password",
            search: createSearchParams({
              username,
            }).toString(),
          });
        } else if (action === UserStatus.CONFIRM_MFA) {
          setCredentials((pre: any) => ({
            ...pre,
            session: signInData.data.session,
            destination: signInData.data.destination,
          }));
          navigate({
            pathname: "/mfa-verify",
            search: createSearchParams({
              username,
            }).toString(),
          });
        }
      }
      if (signInData.success) {
        const cookies = res.headers["Set-Cookie"];
        console.log(res.headers["Set-Cookie"]);
        console.log(cookies);
        // Store the cookies in the browser's cookie storage
        // cookies.forEach((cookie: any) => {
        //   document.cookie = cookie;
        // });

        setAuthState(AUTH_STATE.AUTH);
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      setToasterProps({
        type: "error",
        text: "login-failed",
      });
    }
  };

  return { onSignIn, isLoading };
};

export default useOnSignIn;
