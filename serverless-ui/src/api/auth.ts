import { AxiosResponse } from "axios";
import api from "../utils/api";

const BASE_URL = "/api/auth";

export const signUp = async (username: string, email: string, password: string): Promise<any> =>
  api.post(`${BASE_URL}/signUp`, {
    username: username.trim(),
    email: email.trim(),
    password,
    memberName: username.trim(),
  });

export const signIn = async (username: string, password: string): Promise<AxiosResponse<any>> =>
  api.post(`${BASE_URL}/signIn`, {
    username: username.trim(),
    password,
  });

export const verifyEmail = async (
  username: string,
  verifyCode: string
): Promise<AxiosResponse<any>> => api.post(`${BASE_URL}/verifyEmail`, { username, verifyCode });

export const verifySmsMfa = async (
  username: string,
  mfaCode: string,
  session: string
): Promise<AxiosResponse<any>> => api.post(`${BASE_URL}/smsMfa`, { username, mfaCode, session });

export const updateMfa = async (enable: boolean): Promise<AxiosResponse<any>> =>
  api.post(`${BASE_URL}/updateMfa`, { enable });

export const updatePhoneNumber = async (phoneNumber: string): Promise<AxiosResponse<any>> =>
  api.post(`${BASE_URL}/updatePhone`, { phoneNumber });

export const resendSmsCode = async (): Promise<AxiosResponse<any>> =>
  api.post(`${BASE_URL}/updatePhone`, { resend: true });

export const verifyPhoneNumber = async (confirmationCode: string): Promise<AxiosResponse<any>> =>
  api.post(`${BASE_URL}/verifyPhone`, { confirmationCode });

export const getUserDetails = async (): Promise<AxiosResponse<any>> =>
  api.get(`${BASE_URL}/getUserDetails`);

export const resendCode = async (username: string): Promise<AxiosResponse<any>> =>
  api.post(`${BASE_URL}/resendConfirmationCode`, {
    username: username.trim(),
  });

export const forgotPassword = async (username: string): Promise<AxiosResponse<any>> =>
  api.post(`${BASE_URL}/forgotPassword`, {
    username: username.trim(),
  });

export const resetPassword = async (
  username: string,
  verificationCode: string,
  newPassword: string
): Promise<AxiosResponse<any>> =>
  api.post(`${BASE_URL}/resetPassword`, {
    username: username.trim(),
    verificationCode,
    newPassword,
  });

export const resetPasswordAuth = async (
  oldPassword: string,
  newPassword: string
): Promise<AxiosResponse<any>> =>
  api.post(`${BASE_URL}/resetPasswordAuth`, {
    oldPassword,
    newPassword,
  });

export const forceChangePassword = async (
  username: string,
  oldPassword: string,
  newPassword: string
): Promise<AxiosResponse<any>> =>
  api.post(`${BASE_URL}/forceChangePassword`, {
    username: username.trim(),
    oldPassword,
    newPassword,
  });

export const isLoggedIn = async (): Promise<AxiosResponse<any>> =>
  api.get(`${BASE_URL}/isLoggedIn`);

export const signOut = async (): Promise<AxiosResponse<any>> => api.get(`${BASE_URL}/signOut`);

export const verifyUsername = async (username: string): Promise<AxiosResponse> =>
  api.get(`${BASE_URL}/verify-username`, {
    params: {
      username,
    },
  });
