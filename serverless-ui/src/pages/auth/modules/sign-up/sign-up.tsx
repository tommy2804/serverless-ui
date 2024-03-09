import { useContext, useState } from "react";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Button, CircularProgress } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { InfoOutlined } from "@mui/icons-material";
// import googleIcon from '/images/google-icon.svg';
import { useToasterContext } from "../../../../state/toaster-context";
import ImageContainer from "../../components/image-container/image-container";
import UsernameInput from "../../../../shared/inputs/username-input";
import PasswordInput from "../../../../shared/inputs/password-input";
import EmailInput from "../../../../shared/inputs/email-input";
import { CredentialsContext, credentialsObj } from "../../context/use-credentials-context";
// import GeneralInput from '../../../../shared/inputs/general-input';
import "./sign-up.scss";
import { useAuth } from "../../../../state/auth-context";

const SignUp = () => {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isNameExists, setIsNameExist] = useState<boolean | null>(null);
  const [agree, setAgree] = useState<boolean>(false);
  const [afterClick, setAfterClick] = useState<boolean>(false);
  const { setCredentials } = useContext(CredentialsContext);
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { setToasterProps } = useToasterContext();
  const navigate = useNavigate();

  const onSignUp = async (credentials: credentialsObj) => {
    setAfterClick(true);
    if (!agree) {
      return setToasterProps({
        type: "error",
        text: "agree-to-terms-error",
      });
    }
    if (credentials.password !== credentials.confirmPassword) {
      return setToasterProps({
        type: "error",
        text: "password-not-match",
      });
    }
    try {
      if (isNameExists) {
        setToasterProps({
          type: "error",
          text: "username-already-exist",
        });
        return;
      }
      setIsLoading(true);
      await signUp(credentials.username, credentials.email || "", credentials.password);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
      setToasterProps({
        type: "error",
        text: "general-error",
      });
      return;
    }
    navigate({
      pathname: "/verify-email",
      search: createSearchParams({
        username: credentials.username,
      }).toString(),
    });
  };

  const onSubmit = (data: credentialsObj) => {
    setCredentials(data);
    onSignUp(data);
  };

  return (
    <ImageContainer>
      <div className='sign-up-details-wrapper'>
        <div className='sign-up-title-wrapper'>
          <div className='create-account-header'>
            <div className='create-account-logo'></div>
            <div className='create-account-title-wrapper'>
              <h1>{"create-account"}</h1>
            </div>
            {/* <Button className="sign-up-google-auth-button" variant="contained">
              <img src={googleIcon} alt="icon" />
              {t('sign-up-google')}
            </Button> */}
          </div>
          <form
            onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
            className='sign-up-credentials-wrapper'>
            <UsernameInput
              shouldValidate={true}
              label={`${"username"}*`}
              register={register}
              errors={errors}
              watch={watch}
              isNameExists={isNameExists}
              setIsNameExist={setIsNameExist}
            />
            <EmailInput
              shouldValidate={true}
              label={`${"email"}*`}
              register={register}
              errors={errors}
            />
            {/* <GeneralInput
              shouldValidateRest={false}
              shouldValidateEmpty={false}
              label={
                <div className="label-wrapper">
                  {t('organization-name')}
                  <span className="light-text">({t('optional')})</span>
                </div>
              }
              registerTag="organizationName"
              register={register}
              errors={errors}
            /> */}
            <PasswordInput
              shouldValidate={true}
              label={`${"password"}*`}
              placeholder={"create-password-placeholder"}
              register={register}
              errors={errors}
              watch={watch}
            />
            <PasswordInput
              register={register}
              placeholder={"confirm-password-placeholder"}
              registerTag='confirmPassword'
              errors={errors}
              label={"confirm-password"}
              shouldValidate={true}
              watch={watch}
            />
            <div className='terms-conditions'>
              <Checkbox
                sx={{
                  padding: 0,
                  marginInlineEnd: "0.5rem",
                }}
                checked={agree}
                onChange={() => setAgree(!agree)}
              />
              <span>
                {"agree-to-terms"}
                <span className='sign-up-text-button' onClick={() => {}}>
                  {"terms"}
                </span>
              </span>
              {afterClick && !agree ? (
                <div className='validation-error'>
                  <InfoOutlined className='info-icon' />
                  {"agree-to-terms-error"}
                </div>
              ) : null}
            </div>
            <div className='sign-up-credentials-buttons-wrapper'>
              <Button
                className={isLoading ? "prevent-click" : ""}
                type='submit'
                variant='contained'
                color='primary'>
                {isLoading ? (
                  <div>
                    <CircularProgress
                      sx={{ color: "var(--white-color)", marginTop: "0.5rem" }}
                      size='1.5rem'
                      className='sign-up-loading'
                    />
                  </div>
                ) : (
                  "get-started"
                )}
              </Button>
            </div>
          </form>
          <div className='have-account-wrapper'>
            {"have-account"}
            <Link to='/sign-in' relative='path' className='sign-up-text-button'>
              {"log-in"}
            </Link>
          </div>
        </div>
        <div className='sign-up-language-button'></div>
      </div>
    </ImageContainer>
  );
};

export default SignUp;
