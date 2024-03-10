import { useCallback, useEffect, useRef, useState } from "react";
import { isLoggedIn } from "../api/auth";
import { AUTH_STATE } from "../types/auth-state";
import { Permission } from "../types/user-dto";

const useInitialLoginState = () => {
  const isCalled = useRef(false);
  const [authState, setAuthState] = useState<AUTH_STATE>(AUTH_STATE.LOADING);
  const [userPayload, setUserPayload] = useState<any>(null);
  const [organizationPayload, setOrganizationPayload] = useState<any>(null);
  const getLoginState = async () => {
    const res = await isLoggedIn().catch(
      () => (
        console.log("first"),
        {
          data: { isLoggedIn: false },
        }
      )
    );
    setAuthState(res.data.isLoggedIn ? AUTH_STATE.AUTH : AUTH_STATE.NOT_AUTH);
    if (res.data.isLoggedIn) {
      const { payload } = res.data;
      setUserPayload(payload);
    }
  };

  const isAuthorized = useCallback(
    (permission: Permission) =>
      userPayload?.permissions?.includes(permission) || userPayload?.root === "true",
    [userPayload]
  );

  useEffect(() => {
    console.log(authState);
    if (authState === AUTH_STATE.LOADING) {
      if (isCalled.current) return;
      isCalled.current = true;
      getLoginState();
    } else if (authState === AUTH_STATE.NOT_AUTH) {
      setUserPayload(null);
      setOrganizationPayload(null);
    } else if (authState === AUTH_STATE.AUTH) {
      if (!userPayload) {
        getLoginState();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState]);
  return { authState, userPayload, organizationPayload, getLoginState, setAuthState, isAuthorized };
};

export default useInitialLoginState;
