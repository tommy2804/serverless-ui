import { createContext, useContext } from "react";
import useInitialLoginState from "../hooks/use-initial-login-state";
import { AUTH_STATE } from "../types/auth-state";
import { Permission } from "../types/user-dto";

interface LoginStateContextProps {
  authState: AUTH_STATE;
  userPayload: any;
  organizationPayload: any;
  getLoginState: () => void;
  setAuthState: (authState: AUTH_STATE) => void;
  isAuthorized: (premission: Permission) => boolean;
}

const LoginStateContext = createContext<LoginStateContextProps>({
  authState: AUTH_STATE.LOADING,
  userPayload: null,
  organizationPayload: null,
  getLoginState: () => {},
  setAuthState: () => {},
  isAuthorized: () => false,
});

export const useLoginStateContext = () => useContext<LoginStateContextProps>(LoginStateContext);

export const LoginStateProvider = ({ children }: any) => {
  const { authState, userPayload, organizationPayload, getLoginState, setAuthState, isAuthorized } =
    useInitialLoginState();

  return (
    <LoginStateContext.Provider
      value={{
        authState,
        userPayload,
        organizationPayload,
        getLoginState,
        setAuthState,
        isAuthorized,
      }}>
      {children}
    </LoginStateContext.Provider>
  );
};
