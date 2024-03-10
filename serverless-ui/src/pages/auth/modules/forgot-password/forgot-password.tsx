import { useState } from "react";
import { useForm } from "react-hook-form";
import { createSearchParams, useNavigate } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import { forgotPassword } from "../../../../api/auth";
import ImageContainer from "../../components/image-container/image-container";
import keyIcon from "/images/key-icon.svg";
import BackToLogin from "../../components/back-to-login/back-to-login";
import GeneralInput from "../../../../shared/inputs/general-input";
import "./forgot-password.scss";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const handleFormSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const res = await forgotPassword(data.username);
      if (res.data.success) {
        navigate({
          pathname: "/verify-email",
          search: createSearchParams({
            username: data.username,
            isForgotPassword: "true",
          }).toString(),
        });
      }
    } catch (err) {
      setIsLoading(false);
      console.warn(err);
    }
  };

  return (
    <ImageContainer>
      <div className='forgot-password-wrapper'>
        <div className='forgot-password-center-wrapper'>
          <div className='forgot-password-header'>
            <div className='forgot-password-logo'>
              <span>
                <img src={keyIcon} alt='' />
              </span>
            </div>
            <div className='forgot-password-title-wrapper'>
              <h1>Forgot Password</h1>
              <h3>Please enter your username to reset your password</h3>
            </div>
          </div>
          <form className='forgot-password-form' onSubmit={handleSubmit(handleFormSubmit)}>
            <GeneralInput
              registerTag='username'
              shouldValidateRest={false}
              shouldValidateEmpty={true}
              register={register}
              errors={errors}
            />
            <Button
              className={`forgot-password-btn ${isLoading && "prevent-click"}`}
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

export default ForgotPassword;
