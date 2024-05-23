import React from "react";
import { Box, Divider, InputAdornment, Tooltip } from "@mui/material";
import NearMeOutlined from "@mui/icons-material/NearMeOutlined";
import CameraAltOutlined from "@mui/icons-material/CameraAltOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { DateField, DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useTranslation } from "react-i18next";
import { FlexBetween } from "../components";
import "../styles.scss";
import {
  CustomTextField,
  FormText,
  NonMobileText,
  InputValidationCheckIcon,
} from "../styles/styled-components";
import { DialogFormSxStyles } from "../styles/dialog-form-styles";
import { FormAction, FormActionType, FormState } from "../../../shared/create-event-helpers";
import { inputLengthDisplayHandler } from "../../../utils/form-utils";

interface DialogFormProps {
  dispatch: React.Dispatch<FormAction>;
  formState: FormState;
  isNonMobile: boolean;
  isEventNameValid: boolean;
  isEventUrlValid: boolean;
  isEventUrlExist: boolean;
  initialUrlValue?: string;
  selectedGiftEvent: any;
  debouncedEventUrlValue: string;
  isNextClicked?: boolean;
  giftFields?: string[];
}

enum resoleUrlErrors {
  eventUrlEmptyError = "event-url-empty-error",
  eventUrlAlreadyExists = "event-url-already-exists",
  eventUrlError = "event-url-error",
}

const resolveUrlError = (
  formState: FormState,
  isEventUrlValid: boolean,
  isEventUrlExist: boolean,
  initialUrlValue?: string
) => {
  if (initialUrlValue !== formState.eventURL && (!isEventUrlValid || isEventUrlExist)) {
    if (formState.eventURL.length === 0) return resoleUrlErrors.eventUrlEmptyError;
    if (isEventUrlExist) return resoleUrlErrors.eventUrlAlreadyExists;
    return resoleUrlErrors.eventUrlError;
  }
  return null;
};

const DialogForm: React.FC<DialogFormProps> = ({
  isNonMobile,
  formState,
  dispatch,
  isEventNameValid,
  isEventUrlValid,
  isEventUrlExist,
  selectedGiftEvent,
  initialUrlValue,
  debouncedEventUrlValue,
  isNextClicked,
  giftFields,
}) => {
  const { t, i18n } = useTranslation();

  const urlError = resolveUrlError(formState, isEventUrlValid, isEventUrlExist, initialUrlValue);
  const translateUrlError = urlError ? t(urlError) : null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className='form-container'>
        {isNonMobile ? (
          <>
            <FlexBetween paddingBottom='1rem'>
              <FormText>{t("event-name")} *</FormText>
              <CustomTextField
                isNonMobile={isNonMobile}
                placeholder={t("enter-event-name")}
                variant='outlined'
                customHeight
                label={t("event-name")}
                name='EventName'
                fullWidth
                value={formState.eventName || selectedGiftEvent?.eventName || ""}
                error={!isEventNameValid && isNextClicked}
                // eslint-disable-next-line no-nested-ternary
                helperText={
                  // eslint-disable-next-line no-nested-ternary
                  !isEventNameValid && isNextClicked
                    ? formState.eventName.length === 0
                      ? t("event-name-empty-error")
                      : t("event-name-error")
                    : null
                }
                inputProps={{ maxLength: 25 }}
                onChange={(e) => {
                  dispatch({
                    type: FormActionType.SetField,
                    field: "eventName",
                    value: e.target.value,
                  });
                }}
                onInput={(e) => inputLengthDisplayHandler(e, 25)}
              />
            </FlexBetween>
            <FlexBetween paddingBottom='1rem'>
              <Tooltip title={t("event-url-explaind")}>
                <FormText className='event-url-flex' variant='h6' fontSize='14px'>
                  {t("event-url")}
                  *
                  <InfoOutlinedIcon
                    sx={{
                      fontSize: "1.1rem",
                    }}
                  />
                </FormText>
              </Tooltip>
              <CustomTextField
                isNonMobile={isNonMobile}
                variant='outlined'
                customHeight
                placeholder='event'
                name='EventURL'
                value={formState.eventURL || ""}
                fullWidth
                isLeftIcon={i18n.dir() === "rtl"}
                iconComponent={
                  // eslint-disable-next-line no-nested-ternary
                  initialUrlValue === formState.eventURL ||
                  (!isEventUrlExist &&
                    isEventUrlValid &&
                    formState.eventURL === debouncedEventUrlValue) ? (
                    <InputValidationCheckIcon
                      src='/images/users-page/check-icon.svg'
                      alt='check-icon'
                    />
                  ) : (isEventUrlExist || !isEventUrlValid) &&
                    formState.eventURL &&
                    formState.eventURL === debouncedEventUrlValue ? (
                    <Tooltip title={translateUrlError} placement='top' arrow>
                      <InputValidationCheckIcon
                        src='/images/users-page/warning-icon.svg' // Replace with the cancel icon path
                        alt='warning-icon'
                      />
                    </Tooltip>
                  ) : null
                }
                error={
                  initialUrlValue !== formState.eventURL &&
                  (!isEventUrlValid || isEventUrlExist) &&
                  isNextClicked
                }
                helperText={isNextClicked && translateUrlError}
                InputProps={{
                  [i18n.dir() === "ltr" ? "startAdornment" : "endAdornment"]: (
                    <InputAdornment
                      sx={{ direction: `${i18n.dir() === "ltr" ? "ltr" : "rtl"}` }}
                      position={`${i18n.dir() === "ltr" ? "start" : "end"}`}>
                      izme.ai/
                    </InputAdornment>
                  ),
                }}
                // eslint-disable-next-line react/jsx-no-duplicate-props
                inputProps={{ maxLength: 25, dir: "ltr" }}
                onChange={(e) => {
                  dispatch({
                    type: FormActionType.SetField,
                    field: "eventURL",
                    value: e.target.value,
                  });
                }}
                onInput={(e) => inputLengthDisplayHandler(e, 25)}
                disabled={!!initialUrlValue}
              />
            </FlexBetween>
            <Divider />

            <FlexBetween padding='1rem 0'>
              {/* <DatePicker /> */}
              <FormText>{t("event-date")}</FormText>
              <DesktopDatePicker
                value={formState.eventDate}
                format='DD/MM/YYYY'
                onChange={(e) =>
                  dispatch({
                    type: FormActionType.SetField,
                    field: "eventDate",
                    value: e,
                  })
                }
                sx={DialogFormSxStyles.datePicker}
              />
            </FlexBetween>

            <FlexBetween paddingBottom='1rem'>
              <FormText>{t("location")}</FormText>
              <CustomTextField
                isNonMobile={isNonMobile}
                variant='outlined'
                customHeight
                label={t("location")}
                name='Location'
                value={formState.location || ""}
                iconComponent={
                  <NearMeOutlined color='disabled' sx={DialogFormSxStyles.nearMeIcon} />
                }
                inputProps={{ maxLength: 25 }}
                onChange={(e) =>
                  dispatch({
                    type: FormActionType.SetField,
                    field: "location",
                    value: e.target.value,
                  })
                }
                onInput={(e) => inputLengthDisplayHandler(e, 25)}
                disabled={!!selectedGiftEvent?.location || giftFields?.includes("location")}
              />
            </FlexBetween>
            <FlexBetween paddingBottom='1rem'>
              <FormText>{t("photographer-name")} </FormText>
              <CustomTextField
                isNonMobile={isNonMobile}
                variant='outlined'
                customHeight
                label={t("photographer-name")}
                name='Photographer'
                value={formState.photographer || ""}
                iconComponent={
                  <CameraAltOutlined color='disabled' sx={DialogFormSxStyles.nearMeIcon} />
                }
                fullWidth
                inputProps={{ maxLength: 25 }}
                onChange={(e) =>
                  dispatch({
                    type: FormActionType.SetField,
                    field: "photographer",
                    value: e.target.value,
                  })
                }
                onInput={(e) => inputLengthDisplayHandler(e, 25)}
                disabled={
                  !!selectedGiftEvent?.photographerName || giftFields?.includes("photographerName")
                }
              />
            </FlexBetween>
          </>
        ) : (
          <>
            <Box className='pad-2'>
              <NonMobileText>{t("event-name")} *</NonMobileText>
              <CustomTextField
                isNonMobile={isNonMobile}
                placeholder={t("enter-event-name")}
                variant='outlined'
                customHeight
                name='EventName'
                value={formState.eventName || selectedGiftEvent?.eventName || ""}
                fullWidth
                error={!!formState.eventName && !isEventNameValid && isNextClicked}
                // eslint-disable-next-line no-nested-ternary
                helperText={
                  // eslint-disable-next-line no-nested-ternary
                  !isEventNameValid && isNextClicked
                    ? formState.eventName.length === 0
                      ? t("event-name-empty-error")
                      : t("event-name-error")
                    : null
                }
                inputProps={{ maxLength: 25 }}
                onChange={(e) => {
                  dispatch({
                    type: FormActionType.SetField,
                    field: "eventName",
                    value: e.target.value,
                  });
                }}
                onInput={(e) => inputLengthDisplayHandler(e, 25)}
              />
            </Box>
            <Box className='pad-2' sx={{ pb: "1rem", position: "relative" }}>
              <NonMobileText variant='h6' fontSize='14px'>
                {t("event-url")} *
              </NonMobileText>
              <CustomTextField
                isNonMobile={isNonMobile}
                placeholder='name'
                variant='outlined'
                customHeight
                name='EventURL'
                value={formState.eventURL || ""}
                fullWidth
                isLeftIcon={i18n.dir() === "rtl"}
                iconComponent={
                  // eslint-disable-next-line no-nested-ternary
                  initialUrlValue === formState.eventURL ||
                  (!isEventUrlExist &&
                    isEventUrlValid &&
                    formState.eventURL === debouncedEventUrlValue) ? (
                    <InputValidationCheckIcon
                      src='/images/users-page/check-icon.svg'
                      alt='check-icon'
                    />
                  ) : (isEventUrlExist || !isEventUrlValid) &&
                    formState.eventURL === debouncedEventUrlValue ? (
                    <Tooltip title={translateUrlError} placement='top' arrow>
                      <InputValidationCheckIcon
                        src='/images/users-page/warning-icon.svg' // Replace with the cancel icon path
                        alt='warning-icon'
                      />
                    </Tooltip>
                  ) : null
                }
                error={
                  initialUrlValue !== formState.eventURL &&
                  (!isEventUrlValid || isEventUrlExist) &&
                  isNextClicked
                }
                helperText={isNextClicked && translateUrlError}
                InputProps={{
                  [i18n.dir() === "ltr" ? "startAdornment" : "endAdornment"]: (
                    <InputAdornment
                      sx={{ direction: `${i18n.dir() === "ltr" ? "ltr" : "rtl"}` }}
                      position={`${i18n.dir() === "ltr" ? "start" : "end"}`}>
                      izme.ai/
                    </InputAdornment>
                  ),
                }}
                // eslint-disable-next-line react/jsx-no-duplicate-props
                inputProps={{ maxLength: 25, dir: "ltr" }}
                onChange={(e) => {
                  dispatch({
                    type: FormActionType.SetField,
                    field: "eventURL",
                    value: e.target.value,
                  });
                }}
                onInput={(e) => inputLengthDisplayHandler(e, 25)}
                disabled={!!initialUrlValue}
              />
            </Box>
            <Divider />
            <div className='pad-2 row'>
              <div style={{ width: "40vw", marginInlineEnd: "0.5rem" }}>
                <NonMobileText>{t("event-date")}</NonMobileText>
                <DateField
                  value={formState.eventDate}
                  format='DD/MM/YYYY'
                  onChange={(e) =>
                    dispatch({
                      type: FormActionType.SetField,
                      field: "eventDate",
                      value: e,
                    })
                  }
                  sx={DialogFormSxStyles.datePicker}
                />
              </div>
              <div style={{ width: "40vw" }}>
                <NonMobileText>{t("location")}</NonMobileText>
                <CustomTextField
                  isNonMobile={isNonMobile}
                  customWidth='40vw'
                  variant='outlined'
                  customHeight
                  placeholder={t("location")}
                  name='Location'
                  value={formState.location || ""}
                  iconComponent={
                    <NearMeOutlined color='disabled' sx={DialogFormSxStyles.nearMeIconMobile} />
                  }
                  inputProps={{ maxLength: 25 }}
                  onChange={(e) =>
                    dispatch({
                      type: FormActionType.SetField,
                      field: "location",
                      value: e.target.value,
                    })
                  }
                  onInput={(e) => inputLengthDisplayHandler(e, 25)}
                  disabled={!!selectedGiftEvent?.location || giftFields?.includes("location")}
                />
              </div>
            </div>
            <div className='pad-2'>
              <NonMobileText>{t("photographer-name")}</NonMobileText>
              <CustomTextField
                isNonMobile={isNonMobile}
                variant='outlined'
                customHeight
                name='photographer'
                value={formState.photographer || ""}
                fullWidth
                inputProps={{ maxLength: 25 }}
                placeholder={t("photographer-name")}
                onChange={(e) => {
                  dispatch({
                    type: FormActionType.SetField,
                    field: "photographer",
                    value: e.target.value,
                  });
                }}
                onInput={(e) => inputLengthDisplayHandler(e, 25)}
                disabled={
                  !!selectedGiftEvent?.photographerName || giftFields?.includes("photographerName")
                }
              />
            </div>
          </>
        )}
      </div>
    </LocalizationProvider>
  );
};

export default DialogForm;
