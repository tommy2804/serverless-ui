import { useEffect, useState } from "react";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { GeneralInputInterface } from "./general-input";
import ValidationCheckmark from "../validation-checkmark/validation-checkmark";
import "./input.scss";
import { Tooltip } from "@mui/material";

interface PasswordInputProps extends GeneralInputInterface {
  watch?: any;
}

const PasswordInput = ({
  shouldValidate,
  register,
  label,
  errors,
  registerTag,
  watch,
  placeholder,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [currentVal, setCurrentVal] = useState<string>("");
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean>(false);
  const isConfirmPassword = registerTag === "confirmPassword";

  useEffect(() => {
    if (!watch) return;
    const subscribe = watch((val: any) => {
      const tag = registerTag || "password";
      if (isConfirmPassword && val?.confirmPassword?.length > 0) {
        setIsPasswordMatch(
          (val.newPassword && val.confirmPassword && val.newPassword === val.confirmPassword) ||
            (val.password && val.confirmPassword && val.password === val.confirmPassword)
        );
      } else {
        setIsPasswordMatch(false);
      }
      setCurrentVal(val[tag]);
    });
    return () => subscribe.unsubscribe();
  });

  const isConfirmPasswordMatch = () => {
    if (!watch) return;
    return watch(
      (val: any) =>
        val.newPassword && val.confirmPassword && val.newPassword === val.confirmPassword
    );
  };

  const handleShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <div className='general-input-wrapper'>
      <label>{label || "password"}</label>
      <input
        className='general-input'
        placeholder={placeholder || "password-placeholder"}
        type={showPassword ? "text" : "password"}
        {...register(registerTag || "password", {
          validate: shouldValidate
            ? {
                isEmpty: (value: string) => value?.length > 0 || "empty-validation",
                isEightChar: (value: string) =>
                  /^.{8,}$/.test(value) || "password-length-validation",
                hasLower: (value: string) =>
                  /(?=.*[a-z])/.test(value) || "password-lowercase-validation",
                hasUpper: (value: string) =>
                  /(?=.*[A-Z])/.test(value) || "password-uppercase-validation",
                hasNumber: (value: string) =>
                  /(?=.*\d)/.test(value) || "password-number-validation",
                hasSpecial: (value: string) =>
                  /(?=.*\W)/.test(value) || "password-special-validation",
                isPasswordMatch: isConfirmPassword
                  ? isConfirmPasswordMatch || "password-match-error-validation"
                  : () => {},
              }
            : {},
        })}
      />
      <Tooltip title={showPassword ? "hide-password" : "show-password"}>
        <div onClick={handleShowPassword}>{!showPassword ? <Visibility /> : <VisibilityOff />}</div>
      </Tooltip>
      {!currentVal && errors[registerTag || "password"]?.message ? (
        <div className='validation-error'>
          <InfoOutlined className='info-icon' />
          {errors[registerTag || "password"]?.message as string}
        </div>
      ) : (
        ""
      )}
      {watch && registerTag !== "confirmPassword" ? (
        <div className='password-validation-group'>
          <ValidationCheckmark
            selected={currentVal ? /^.{8,}$/.test(currentVal) : false}
            text={"password-length-validation"}
          />
          <ValidationCheckmark
            selected={/(?=.*[a-z])/.test(currentVal) && /(?=.*[A-Z])/.test(currentVal)}
            text={"password-lowercase-uppercase-validation"}
          />
          <ValidationCheckmark
            selected={/(?=.*\d)/.test(currentVal) && /(?=.*\W)/.test(currentVal)}
            text={"password-number-special-validation"}
          />
        </div>
      ) : (
        ""
      )}
      {isConfirmPassword ? (
        <div className='password-validation-group'>
          <ValidationCheckmark selected={isPasswordMatch} text={"password-match"} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default PasswordInput;
