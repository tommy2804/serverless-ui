import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Select,
  OutlinedInput,
  MenuItem,
  ListItemText,
  FormControl,
  useMediaQuery,
} from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import { CustomTextField } from "../styled-components";
import { useContactUsContext } from "../../../../context/contact-us-context";
import { setFieldTypes } from "../../utils";
import { FormText, contactUsSxStyles } from "../../sx-styles";
import { createContactMessage } from "../../../../utils/api";
import { isEmailValid } from "../../../../utils/validation";
import { InputState } from "../../../../utils/helpers";

interface ContactUsFormProps {
  isNonMobile: boolean;
  setIsSendSuccess: (value: React.SetStateAction<boolean>) => void;
}
const subjects = ["collaboration", "payments", "suggestions", "accessibility", "other"];
const ContactUsForm: React.FC<ContactUsFormProps> = ({ isNonMobile, setIsSendSuccess }) => {
  const device1250 = useMediaQuery("(min-width:1250px)");
  const { formState, handleChange, handleClear } = useContactUsContext();
  const { t, i18n } = useTranslation();
  const [emailError, setEmailError] = useState("");
  const { fullName, email, phoneNumber, subject, message } = formState;

  const contactState = { fullName, email, phoneNumber, subject, message };

  const sendMessage = async () => {
    const res = await createContactMessage(contactState);
    if (res.data.success) {
      setIsSendSuccess(true);
      handleClear();
    } else {
      console.log("error creating new contact message");
    }
  };

  const authContactForm = () => (
    <>
      <div className='full-width-input'>
        <FormText>{t("full-name")}</FormText>
        <CustomTextField
          value={fullName}
          isNonMobile={isNonMobile}
          placeholder={t("full-name")}
          variant='outlined'
          onChange={(e) => handleChange(setFieldTypes.fullName, e.target.value)}
          customHeight
        />
      </div>
      <div className='full-width-input'>
        <FormText>{t("email-address")}</FormText>
        <CustomTextField
          value={email}
          placeholder='you@company.com'
          isNonMobile={isNonMobile}
          type='email'
          variant='outlined'
          onChange={(e) => handleChange(setFieldTypes.email, e.target.value)}
          customHeight
          inputState={emailError ? InputState.ERROR : InputState.DEFAULT}
          onBlur={() => {
            if (isEmailValid(email) && emailError) {
              setEmailError("");
            } else if (!isEmailValid(email) && !emailError) {
              setEmailError(t("email-error"));
            }
          }}
        />
        {emailError && <span className='error-message'>{emailError}</span>}
      </div>
      <div className='full-width-input'>
        <FormText>{t("phone-number")}</FormText>
        <MuiTelInput
          value={phoneNumber}
          onChange={(e) => handleChange(setFieldTypes.phoneNumber, e)}
          defaultCountry={`${i18n.dir() === "rtl" ? "IL" : "US"}`}
          // flagSize="small"
          sx={contactUsSxStyles.inputStyle}
        />
      </div>
    </>
  );

  return (
    <div className='contact-us-form-container'>
      {authContactForm()}
      <div
        className='full-width-input'
        style={{
          marginBlockStart: "2rem",
          marginBlockEnd: 0,
        }}>
        <FormControl sx={{ width: "100%", marginBlock: 0 }}>
          <FormText>{t("subject")}</FormText>
          <Select
            variant='outlined'
            onChange={(e) => handleChange(setFieldTypes.subject, e.target.value)}
            autoWidth
            fullWidth
            value={subject}
            displayEmpty
            input={<OutlinedInput />}
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <p>{t("choose")}</p>;
              }
              return <p key={subject}>{t(subject)}</p>;
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                  // eslint-disable-next-line no-nested-ternary
                  width: device1250 ? "24vw" : isNonMobile ? "38vw" : "75%",
                },
              },
            }}
            inputProps={{ "aria-label": "Without label" }}
            sx={contactUsSxStyles.inputStyle}>
            {subjects.map((name) => (
              <MenuItem key={name} value={name} sx={contactUsSxStyles.subjectsInput}>
                <ListItemText primary={t(name)} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className='full-width-input'>
        <FormText>{t("message")}</FormText>
        <CustomTextField
          value={message}
          isNonMobile={isNonMobile}
          placeholder={t("message")}
          variant='outlined'
          onChange={(e: { target: { value: any } }) =>
            handleChange(setFieldTypes.message, e.target.value)
          }
          customHeight
          multiline
          minRows={4}
          style={{
            marginBlockEnd: 0,
          }}
        />
      </div>
      <div className='contact-us-action'>
        <button onClick={sendMessage} className='basic-medium width100'>
          {t("submit")}
        </button>
      </div>
    </div>
  );
};

export default ContactUsForm;
