import { useContext, useEffect, useState, useRef } from "react";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import ImageContainer from "../../components/image-container/image-container";
import { resendCode, verifyEmail } from "../../../../api/auth";
import emailIcon from "/images/email-icon.svg";
import BackToLogin from "../../components/back-to-login/back-to-login";
import { CredentialsContext } from "../../context/use-credentials-context";
import { useToasterContext } from "../../../../state/toaster-context";
import useOnSignIn from "../sign-in/use-on-sign-in";
import "./verify-email.scss";

const VerifyEmail = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const location = useLocation();
  const { credentials } = useContext(CredentialsContext);
  const searchParams = new URLSearchParams(location.search);
  const username = searchParams.get("username") || "";
  const isForgotPassword = searchParams.get("isForgotPassword") || "";
  const shouldResend = searchParams.get("shouldResend") || "";
  const navigate = useNavigate();
  const { onSignIn } = useOnSignIn();
  const { setToasterProps } = useToasterContext();

  const inputRefs = [
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
    useRef<any>(null),
  ];

  const handleOnFocus = (e: any) => {
    e.target.select();
  };

  const onResendCode = async () => {
    try {
      const res = await resendCode(username);
      if (res.data.success) {
        setToasterProps({
          type: "success",
          text: "resend-success",
        });
      }
    } catch {
      setToasterProps({
        type: "error",
        text: "resend-failed",
      });
    }
  };

  const createAfterVerifyCallback = () => {
    if (credentials.username && credentials.password) {
      onSignIn(credentials.username, credentials.password)();
      return;
    }
    navigate("/sign-in");
  };

  const onVerifyEmail = async () => {
    if (code.length !== 6) {
      setToasterProps({
        type: "error",
        text: "valid-email-code",
      });
      return;
    }
    if (isForgotPassword === "true") {
      navigate({
        pathname: "/change-password",
        search: createSearchParams({ code, username }).toString(),
      });
      return;
    }
    try {
      setIsLoading(true);
      const res = await verifyEmail(username, code.toString().replaceAll(",", ""));
      if (res.data.success) {
        setToasterProps({
          type: "success",
          text: "verify-email-successful",
        });
        createAfterVerifyCallback();
      }
    } catch (err) {
      setIsLoading(false);
      console.warn(err);
      setToasterProps({
        type: "error",
        text: "verify-email-failed",
      });
    }
  };

  const handleOnChange = (index: number) => (e: any) => {
    if (inputRefs[index] === null) return;
    const input = e.target;
    const previousInput = inputRefs[index - 1];
    const nextInput = inputRefs[index + 1];
    const newCode = [...code];
    if (input.value.length > 1) newCode[index] = input.value.slice(0, 1);
    else {
      newCode[index] = input.value;
    }
    setCode(newCode.join(""));
    if (input.value === "") {
      if (previousInput) {
        previousInput.current.focus();
      }
    } else if (nextInput) {
      nextInput.current.select();
    }
  };

  const handleOnKeyDown = (index: number) => (e: any) => {
    if (inputRefs[index] === null) return;
    const input = e.target;
    const previousInput = inputRefs[index - 1];
    if ((e.keyCode === 8 || e.keyCode === 46) && input.value === "") {
      e.preventDefault();
      setCode((prevCode) => prevCode.slice(0, index) + prevCode.slice(index + 1));
      if (previousInput) {
        previousInput.current.focus();
      }
    }
  };

  const handleOnPaste = (e: any) => {
    const pastedCode = e.clipboardData.getData("text");
    const isNumber = /^\d+$/.test(pastedCode) || false;
    if (pastedCode.length !== 6 || !isNumber) return;
    setCode(pastedCode);
    inputRefs.forEach((inputRef, index) => {
      inputRef.current.value = pastedCode.charAt(index);
    });
  };

  const handleOnInput = (e: any) => {
    const valNoSpace = e.target.value.replaceAll(" ", "");
    const isNumber = /^\d+$/.test(valNoSpace) || false;
    if (!isNumber) e.target.value = "";
    if (!e.target.value) {
      e.target.value = "";
    }
  };

  useEffect(() => {
    if (shouldResend) {
      onResendCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (code.length === 6) {
      onVerifyEmail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  if (!username) navigate("/sign-in");

  return (
    <ImageContainer>
      <div className='verify-email-wrapper'>
        <div className='verify-email-center-wrapper'>
          <div className='verify-email-header'>
            <div className='verify-email-logo'>
              <span>
                <img src={emailIcon} alt='' />
              </span>
            </div>
            <div className='verify-email-title-wrapper'>
              <h1>{"verify-email-title"}</h1>
              <span>
                <h3>{"verify-email-sub-title"}</h3>
                <h4>{credentials.email || username}</h4>
              </span>
            </div>
          </div>
          <div className={`verify-email-inputs-wrapper flex-row-reverse"`}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                onInput={handleOnInput}
                inputMode='numeric'
                className='verify-email-input'
                key={index}
                type='text'
                maxLength={1}
                onChange={handleOnChange(index)}
                ref={inputRefs[index]}
                autoFocus={index === 0}
                onFocus={handleOnFocus}
                onKeyDown={handleOnKeyDown(index)}
                onPaste={handleOnPaste}
              />
            ))}
          </div>
          <div className='verify-email-btn-wrapper'>
            <Button
              onClick={onVerifyEmail}
              className={`verify-email-btn ${isLoading && "prevent-click"}`}
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
              ) : isForgotPassword ? (
                "set-new-password"
              ) : (
                "continue"
              )}
            </Button>
          </div>
          <div className='verify-email-resend-wrapper'>
            {"received-email"}
            <button onClick={onResendCode} className='resend-btn'>
              {"click-to-resend"}
            </button>
          </div>
          <BackToLogin />
        </div>
      </div>
    </ImageContainer>
  );
};

export default VerifyEmail;
