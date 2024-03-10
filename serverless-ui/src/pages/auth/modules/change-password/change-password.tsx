import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import { forceChangePassword, resetPassword } from "../../../../api/auth";
import ImageContainer from "../../components/image-container/image-container";
import lockIcon from "/images/lock-icon.svg";
import BackToLogin from "../../components/back-to-login/back-to-login";
import PasswordInput from "../../../../shared/inputs/password-input";
import { useToasterContext } from "../../../../state/toaster-context";
import { CredentialsContext } from "../../context/use-credentials-context";
import useOnSignIn from "../sign-in/use-on-sign-in";
import "./change-password.scss";

const ChangePassword = () => {
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const location = useLocation();

  const { credentials } = useContext(CredentialsContext);
  const code = new URLSearchParams(location.search).get("code") || "";
  const username = new URLSearchParams(location.search).get("username") || "";
  const navigate = useNavigate();
  const { onSignIn } = useOnSignIn();
  const { setToasterProps } = useToasterContext();

  const handleFormSubmit = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      return setToasterProps({
        type: "error",
        text: "Passwords do not match",
      });
    }
    try {
      setIsLoading(true);
      if (!code) {
        const res = await forceChangePassword(username, credentials.password, data.newPassword);
        if (res.data.success) {
          onSignIn(username, data.confirmPassword)();
        }
      } else {
        const res = await resetPassword(username, code, data.confirmPassword);
        if (res.data.success) {
          onSignIn(username, data.confirmPassword)();
        }
      }
    } catch (err) {
      setIsLoading(false);
      setToasterProps({
        type: "error",
        text: "An error occurred. Please try again later.",
      });
      navigate({
        pathname: "/verify-email",
        search: createSearchParams({
          username,
          isForgotPassword: "true",
          shouldResend: "true",
        }).toString(),
      });
    }
  };

  if (!username) navigate("/sign-in");

  return (
    <ImageContainer>
      <div className='change-password-wrapper'>
        <div className='change-password-center-wrapper'>
          <div className='change-password-header'>
            <div className='change-password-logo'>
              <span>
                <img src={lockIcon} alt='' />
              </span>
            </div>
            <div className='change-password-title-wrapper'>
              <h1>Change Password</h1>
              <h3>Please enter a new password</h3>
            </div>
          </div>
          <form className='change-password-form' onSubmit={handleSubmit(handleFormSubmit)}>
            <PasswordInput
              placeholder='Enter your new password'
              registerTag='newPassword'
              register={register}
              errors={errors}
              watch={watch}
              shouldValidate={true}
            />
            <PasswordInput
              register={register}
              placeholder='Confirm your new password'
              registerTag='confirmPassword'
              errors={errors}
              label='Confirm Password'
              shouldValidate={true}
              watch={watch}
            />
            <Button
              className={`change-password-btn ${isLoading && "prevent-click"}`}
              type='submit'
              variant='contained'
              color='primary'>
              {isLoading ? (
                <div>
                  <CircularProgress
                    sx={{
                      color: "var(--white-color)",
                      position: "relative",
                      top: "0.2rem",
                    }}
                    size='1rem'
                    className='sign-up-loading'
                  />
                </div>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
          <BackToLogin />
        </div>
      </div>
    </ImageContainer>
  );
};

export default ChangePassword;
