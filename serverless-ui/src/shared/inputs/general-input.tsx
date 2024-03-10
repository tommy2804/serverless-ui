import { ReactNode } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import "./input.scss";

export interface GeneralInputInterface {
  shouldValidate?: boolean;
  register: any;
  errors: any;
  label?: string | ReactNode;
  onChange?: any;
  registerTag?: string;
  placeholder?: string;
}

interface GeneralProps extends GeneralInputInterface {
  shouldValidateRest: boolean;
  shouldValidateEmpty: boolean;
}

const GeneralInput = ({
  shouldValidateRest,
  shouldValidateEmpty,
  register,
  errors,
  label,
  onChange,
  registerTag,
  placeholder,
}: GeneralProps) => {
  return (
    <div className='general-input-wrapper'>
      <label>{label || "username"}</label>
      <input
        className='general-input'
        placeholder={placeholder || "name-placeholder"}
        onChange={null || onChange}
        {...register(registerTag || "general", {
          validate: {
            isEmpty: (value: string) => {
              if (!shouldValidateEmpty) return true;
              if (value?.length > 0) return true;
              return "empty-validation";
            },
            isEnglishOnly: (value: string) => {
              if (!shouldValidateRest) return true;
              if (/^[a-zA-Z0-9]+$/.test(value)) return true;
              return "english-letters-only";
            },
          },
        })}
      />
      {errors[registerTag || "general"]?.message && (
        <div className='validation-error'>
          <InfoOutlinedIcon className='info-icon' />{" "}
          {errors[registerTag || "general"]?.message as string}
        </div>
      )}
    </div>
  );
};

export default GeneralInput;
