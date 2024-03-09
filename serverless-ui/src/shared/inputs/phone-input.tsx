import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import "./input.scss";
import { GeneralInputInterface } from "./general-input";

const PhoneInput = ({
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
      <label>{label || "phone"}</label>
      <input
        className='general-input'
        placeholder={placeholder || "phone-placeholder"}
        onChange={null || onChange}
        type='number'
        {...register(registerTag || "phone", {
          valueAsNumber: true,
          validate: {
            isEmpty: shouldValidate
              ? (value: string) => value?.length > 0 || "empty-validation"
              : () => {},
            isCellphone: (value: number) => {
              const isCell = /^[0-9]{10}$/.test(value.toString());
              if (!value && value !== 0) return true;
              if (isCell) return true;
              return t("phone-validation");
            },
          },
        })}
      />
      {errors[registerTag || "phone"]?.message && (
        <div className='validation-error'>
          <InfoOutlinedIcon className='info-icon' />{" "}
          {errors[registerTag || "phone"]?.message as string}
        </div>
      )}
    </div>
  );
};

export default PhoneInput;
