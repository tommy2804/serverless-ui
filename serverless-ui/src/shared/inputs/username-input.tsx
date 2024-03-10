import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { verifyUsername } from "../../api/auth";
import { GeneralInputInterface } from "./general-input";
import { useToasterContext } from "../../state/toaster-context";
import "./input.scss";
import { isUsernameCharsValid } from "../../utils/validation";
import { Tooltip } from "@mui/material";

interface UsernameInputProps extends GeneralInputInterface {
  watch: any;
  isNameExists: boolean | null;
  setIsNameExist: (item: boolean | null) => void;
}

const UsernameInput = ({
  shouldValidate,
  register,
  errors,
  label,
  onChange,
  registerTag,
  placeholder,
  watch,
  isNameExists,
  setIsNameExist,
}: UsernameInputProps) => {
  const [currentVal, setCurrentVal] = useState<string>("");
  const [debouncedUserNameValue] = useDebounce(currentVal, 300);
  const { setToasterProps } = useToasterContext();

  const fetchVerify = async (username: string) => {
    try {
      const res = await verifyUsername(username);
      const isExist = res.data.exist;
      if (!isExist) return setIsNameExist(false);

      if (isExist) {
        setToasterProps({
          type: "error",
          text: "username-already-exist",
        });
      }
      setIsNameExist(true);
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    const subscribe = watch((val: any) => {
      const tag = registerTag || "username";
      if (val[tag].length === 0) setIsNameExist(null);
      setCurrentVal(val[tag]);
    });
    return () => subscribe.unsubscribe();
  });

  useEffect(() => {
    if (debouncedUserNameValue.length < 1) return;
    // fetchVerify(debouncedUserNameValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedUserNameValue]);

  const handleExistUserBody = () => {
    if (isNameExists === null) return "";
    if (isNameExists || !isUsernameCharsValid(debouncedUserNameValue)) {
      const text = isNameExists ? "username-exists" : "english-letters-only";
      return (
        <Tooltip title={text}>
          <img
            src='/images/users-page/warning-icon.svg' // Replace with the cancel icon path
            alt='warning-icon'
            className='check-icon'
          />
        </Tooltip>
      );
    }
    return <img src='/images/users-page/check-icon.svg' alt='check-icon' className='check-icon' />;
  };

  const handleExistUserBodyIcon = () => {
    if (isNameExists === null) return "";
    if (isNameExists || !isUsernameCharsValid(debouncedUserNameValue)) return "username-not-exist";
    return "username-exist";
  };

  return (
    <div className='general-input-wrapper'>
      <div className='username-input-label'>
        <label>{label || "username"}</label>
        {handleExistUserBody()}
      </div>
      <input
        className={`general-input ${handleExistUserBodyIcon()}`}
        placeholder={placeholder || "name-placeholder"}
        onChange={null || onChange}
        {...register(registerTag || "username", {
          validate: {
            isEmpty: shouldValidate
              ? (value: string) => value?.length > 0 || "empty-validation"
              : () => {},
            isEnglishOnly: (value: string) => {
              if (!shouldValidate && value.length < 1) return true;
              if (isUsernameCharsValid(value)) return true;
              return "english-letters-only";
            },
          },
        })}
      />
      {errors[registerTag || "username"]?.message && (
        <div className='validation-error'>
          <InfoOutlinedIcon className='info-icon' />{" "}
          {errors[registerTag || "username"]?.message as string}
        </div>
      )}
    </div>
  );
};

export default UsernameInput;
