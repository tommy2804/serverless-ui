import { User, CurrentUser, AxiosResUser } from "../types/user";
import api from "../utils/api";
import { AxiosResponse } from "axios";

const signUp = async (
  email: string,
  password: string,
  lastName: string,
  firstName: string
): Promise<AxiosResponse<AxiosResUser>> => {
  return api.post("/auth/signup", { email, password, firstName, lastName });
};

const signIn = async (
  email: string,
  password: string
): Promise<AxiosResponse<AxiosResUser>> => {
  return api.post("/auth/signin", { email, password });
};

const forceChangePassword = async (
  email: string,
  oldPassword: string,
  newPassword: string
): Promise<AxiosResponse<User>> => {
  return api.post("/auth/forceChangePassword", {
    email,
    oldPassword,
    newPassword,
  });
};

const isLoggedIn = async (): Promise<AxiosResponse<CurrentUser>> => {
  return api.get("/auth/currentuser");
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const signOut = async (): Promise<any> => {
  return api.post("/auth/signout");
};

export { signUp, signIn, isLoggedIn, forceChangePassword, signOut };
