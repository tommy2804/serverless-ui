import { useContext, useState } from "react";
// import googleIcon from '/images/google-icon.svg';
import { Button, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { CredentialsContext, credentialsObj } from "../../context/use-credentials-context";
import ImageContainer from "../../components/image-container/image-container";
import PasswordInput from "../../../../shared/inputs/password-input";
import GeneralInput from "../../../../shared/inputs/general-input";
import useOnSignIn from "./use-on-sign-in";
import { useToasterContext } from "../../../../state/toaster-context";
import "./sign-in.scss";

const SignIn = () => {
  const { setCredentials } = useContext(CredentialsContext);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isTooManyAttempts, setIsTooManyAttempts] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { setToasterProps } = useToasterContext(); // Assuming t is available from the toaster context

  const { isLoading, onSignIn } = useOnSignIn();

  const onSubmit = (data: credentialsObj) => {
    if (!data.username || !data.password) {
      // Assuming setToasterProps is available from the toaster context
      setToasterProps({
        type: "error",
        text: "no-input-error",
      });
      return;
    }
    setCredentials({ username: data.username, password: data.password });
    onSignIn(data.username, data.password)();
  };

  return (
    <ImageContainer>
      <div className='sign-in-details-wrapper'>
        <div className='sign-in-title-wrapper'>
          <div className='welcome-header'>
            {/* Logo removed */}
            <div className='welcome-title-wrapper'>
              <h1>{"welcome-back"}</h1>
              <h3>{"welcome-back-desc"}</h3>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
            className='sign-in-credentials-wrapper'>
            <GeneralInput
              registerTag='username'
              shouldValidateRest={false}
              shouldValidateEmpty={true}
              register={register}
              errors={errors}
            />
            <PasswordInput shouldValidate={false} register={register} errors={errors} />
            <div className='credentials-options-wrapper'>
              <Link to='/forgot-password' relative='path' className='sign-in-text-button'>
                {"forgot-password"}
              </Link>
            </div>
            {isTooManyAttempts ? (
              <div className='locked-account-err'>
                <span className='locked-account-title'>{"too-many-err"}</span>
                <span className='locked-account-sub-title'>{"too-many-err-sub"}</span>
              </div>
            ) : (
              ""
            )}
            <div className='credentials-buttons-wrapper'>
              <Button
                className={`credentials-button ${isLoading && "prevent-click"}`}
                type='submit'
                variant='contained'
                color='primary'>
                {isLoading ? (
                  <div>
                    <CircularProgress
                      sx={{ color: "var(--white-color)", marginTop: "0.5rem" }}
                      size='1.5rem'
                    />
                  </div>
                ) : (
                  "sign-in"
                )}
              </Button>
              {/* Google sign-in button removed */}
            </div>
          </form>
          <div className='sign-in-sign-up-link'>
            {"sign-up-desc"}
            <Link to='/sign-up' relative='path' className='sign-in-text-button'>
              {"sign-up"}
            </Link>
          </div>
        </div>
        {/* LanguageToggle removed */}
      </div>
    </ImageContainer>
  );
};

export default SignIn;
