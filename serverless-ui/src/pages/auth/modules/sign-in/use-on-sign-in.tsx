import { useState, useContext } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import { useToasterContext } from "../../../../state/toaster-context";
import { signIn } from "../../../../api/auth";
import { UserStatus } from "../../../../types/user-status";
import { AUTH_STATE } from "../../../../types/auth-state";
import { CredentialsContext } from "../../context/use-credentials-context";
import { useLoginStateContext } from "../../../../state/login-context";

const useOnSignIn = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setToasterProps } = useToasterContext();
  const { setAuthState } = useLoginStateContext();
  const navigate = useNavigate();
  const { setCredentials } = useContext(CredentialsContext);

  const onSignIn = (username: string, password: string) => async () => {
    try {
      setIsLoading(true);
      const res: any = await signIn(username, password);
      if (!res.data.success && !res.data?.err) {
        if (res.data.action === UserStatus.UNCONFIRMED) {
          navigate({
            pathname: "/verify-email",
            search: createSearchParams({
              username,
            }).toString(),
          });
        }
        if (res.data.action === UserStatus.FORCE_CHANGE_PASSWORD)
          navigate({
            pathname: "/change-password",
            search: createSearchParams({
              username,
            }).toString(),
          });
        if (res.data.action === UserStatus.CONFIRM_MFA) {
          setCredentials((pre: any) => ({
            ...pre,
            session: res.data.session,
            destination: res.data.destination,
          }));
          navigate({
            pathname: "/mfa-verify",
            search: createSearchParams({
              username,
            }).toString(),
          });
        }
      }
      if (res.data.success) {
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
