import { useContext, useState } from 'react';
// import googleIcon from '/images/google-icon.svg';
import { useTranslation } from 'react-i18next';
import { Button, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { CredentialsContext, credentialsObj } from '../../context/use-credentials-context';
import ImageContainer from '../../components/image-container/image-container';
import PasswordInput from '../../../../shared/inputs/password-input';
import GeneralInput from '../../../../shared/inputs/general-input';
import LanguageToggle from '../../components/language-toggle/language-toggle';
import useOnSignIn from './use-on-sign-in';
import { useIzmeToasterContext } from '../../../../utils/context/izme-toaster-context';
import './sign-in.scss';
import Logo from '../../../../shared/logo';

const SignIn = () => {
  const { setCredentials } = useContext(CredentialsContext);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isTooManyAttempts, setIsTooManyAttempts] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { t } = useTranslation();
  const { setToasterProps } = useIzmeToasterContext();

  const { isLoading, onSignIn } = useOnSignIn();

  const onSubmit = (data: credentialsObj) => {
    if (!data.username || !data.password) {
      setToasterProps({
        type: 'error',
        text: t('no-input-error'),
      });
      return;
    }
    setCredentials({ username: data.username, password: data.password });
    onSignIn(data.username, data.password)();
  };

  return (
    <ImageContainer>
      <div className="sign-in-details-wrapper">
        <div className="sign-in-title-wrapper">
          <div className="welcome-header">
            <div className="welcome-logo">
              <Logo />
            </div>
            <div className="welcome-title-wrapper">
              <h1>{t('welcome-back')}</h1>
              <h3>{t('welcome-back-desc')}</h3>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}
            className="sign-in-credentials-wrapper"
          >
            <GeneralInput
              registerTag="username"
              shouldValidateRest={false}
              shouldValidateEmpty={true}
              register={register}
              errors={errors}
            />
            <PasswordInput shouldValidate={false} register={register} errors={errors} />
            <div className="credentials-options-wrapper">
              <Link to="/forgot-password" relative="path" className="sign-in-text-button">
                {t('forgot-password')}
              </Link>
            </div>
            {isTooManyAttempts ? (
              <div className="locked-account-err">
                <span className="locked-account-title">{t('too-many-err')}</span>
                <span className="locked-account-sub-title">{t('too-many-err-sub')}</span>
              </div>
            ) : (
              ''
            )}
            <div className="credentials-buttons-wrapper">
              <Button
                className={`credentials-button ${isLoading && 'prevent-click'}`}
                type="submit"
                variant="contained"
                color="primary"
              >
                {isLoading ? (
                  <div>
                    <CircularProgress
                      sx={{ color: 'var(--white-color)', marginTop: '0.5rem' }}
                      size="1.5rem"
                    />
                  </div>
                ) : (
                  t('sign-in')
                )}
              </Button>
              {/* <Button
                className={`credentials-google-auth-button ${isLoading && 'prevent-click'}`}
                variant="contained"
              >
                <img src={googleIcon} alt="icon" />
                {t('sign-in-google')}
              </Button> */}
            </div>
          </form>
          <div className="sign-in-sign-up-link">
            {t('sign-up-desc')}
            <Link to="/sign-up" relative="path" className="sign-in-text-button">
              {t('sign-up')}
            </Link>
          </div>
        </div>
        <LanguageToggle />
      </div>
    </ImageContainer>
  );
};

export default SignIn;
