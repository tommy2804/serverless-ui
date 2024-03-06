import * as yup from "yup";
import "./auth.scss";
import { useState } from "react";
import { SignInUser, SignUpUser } from "../../types/auth";
import SignInAdmin from "./sign-in-admin";
import SignUpAdmin from "./sign-up-admin";
import { signUp, signIn } from "../../api/auth";

export const registerSchema = yup.object().shape({
  username: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

export const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

export const initialValuesRegister: SignUpUser = {
  username: "",
  email: "",
  password: "",
};

export const initialValuesLogin: SignInUser = {
  email: "",
  password: "",
};

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const handlePasswordToggle = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleIsLogin = () => {
    setIsLogin((prevIsLogin) => !prevIsLogin);
  };

  const onRegister = async (values: SignUpUser) => {
    const { email, password, username } = values;
    const { data } = await signUp(email, password, username);

    if (data) {
      localStorage.setItem("userToken", data.token);
      window.location.href = "/";
    }
  };

  const onSignin = async (values: SignInUser) => {
    const { email, password } = values;
    const { data } = await signIn(email, password);
    if (data) {
      localStorage.setItem("userToken", data.token);
      window.location.href = "/";
    }
  };

  return (
    <div className="container">
      {isLogin ? (
        <SignInAdmin
          handleIsLogin={handleIsLogin}
          showPassword={showPassword}
          handlePasswordToggle={handlePasswordToggle}
          onSignin={onSignin}
        />
      ) : (
        <SignUpAdmin
          handleIsLogin={handleIsLogin}
          showPassword={showPassword}
          handlePasswordToggle={handlePasswordToggle}
          onRegister={onRegister}
        />
      )}
    </div>
  );
};

export default Auth;
