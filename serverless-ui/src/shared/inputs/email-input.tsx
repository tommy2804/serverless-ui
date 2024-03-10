import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { GeneralInputInterface } from "./general-input";
import "./input.scss";

const EmailInput = ({
  shouldValidate,
  register,
  errors,
  label,
  onChange,
  registerTag,
  placeholder,
}: GeneralInputInterface) => {
  return (
    <div className='general-input-wrapper'>
      <label>{label || "email"}</label>
      <input
        className='general-input'
        placeholder={placeholder || "email-placeholder"}
        onChange={null || onChange}
        {...register(registerTag || "email", {
          validate: {
            isEmpty: shouldValidate
              ? (value: string) => value?.length > 0 || "empty-validation"
              : () => {},
            isEmailMatch: (value: string) => {
              const isEmail =
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                  value
                );
              if (value.length === 0 && !shouldValidate) return true;
              if (isEmail) return true;
              return "email-validation";
            },
          },
        })}
      />
      {errors[registerTag || "email"]?.message && (
        <div className='validation-error'>
          <InfoOutlinedIcon className='info-icon' />{" "}
          {errors[registerTag || "email"]?.message as string}
        </div>
      )}
    </div>
  );
};

export default EmailInput;
