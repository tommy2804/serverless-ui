import React, { useEffect, useRef } from "react";
import "../styles/dialog-eventCreated.scss";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import KeyboardBackspaceOutlined from "@mui/icons-material/KeyboardBackspaceOutlined";
import useInitialLoginState from "../../../hooks/use-initial-login-state";
import { useToasterContext } from "../../../state/toaster-context";
import { FormState } from "../../../shared/create-event-helpers";

const BUTTON_COLOR = "e31b54";

type TranzilaLang = "il" | "us";

interface IStandAloneValues {
  thtk: string;
  sum: number;
}

interface DialogEventCreatedProps {
  handleNext: () => void;
  formState: FormState;
  onFailedPayment?: () => void;
  standAloneValues?: IStandAloneValues;
  handleBack?: () => void;
}

const resolveTranzilaUrl = (
  name: string,
  thtk: string,
  sum: number,
  lang: TranzilaLang,
  email: string
) =>
  `https://direct.tranzila.com/${name}/iframenew.php?thtk=${thtk}&new_process=1&sum=${sum}&currency=1&lang=${lang}&email=${email}}`;

const DialogTranzilaPayment: React.FC<DialogEventCreatedProps> = ({
  formState,
  standAloneValues,
  handleBack,
}) => {
  const { t, i18n } = useTranslation();
  const { userPayload } = useInitialLoginState();

  const { thtk: contextThtk, sum: contextSum } = formState;

  const { thtk: standAloneThtk, sum: standAloneSum } = standAloneValues || {};
  const thtk = standAloneThtk || contextThtk;
  const sum = standAloneSum || contextSum;
  const email = userPayload?.email;
  if (!thtk || !sum) return null;

  const tranzilaLang = i18n.language === "he" || i18n.language === "he-IL" ? "il" : "us";
  const tranzilaName = location.hostname.includes("izme.ai") ? "izmeai" : "izme1242";

  return (
    <div className='container-dialog-eventCreated'>
      {handleBack ? (
        <button
          className='back-button-container back-button-tranzila rmv-default'
          style={{
            right: i18n.dir() === "rtl" ? "1rem" : "unset",
            left: i18n.dir() === "ltr" ? "1rem" : "unset",
          }}
          onClick={handleBack}>
          <div className='back-icon'>
            <KeyboardBackspaceOutlined
              sx={{
                fontSize: "18px",
                marginBlockStart: "0.1rem",
                transform: i18n.dir() === "rtl" ? "rotate(180deg)" : "",
              }}
            />
          </div>
          <Typography> {t("back")}</Typography>
        </button>
      ) : null}
      <iframe
        title='tranzila'
        className='tranzila-window'
        src={resolveTranzilaUrl(tranzilaName, thtk, sum, tranzilaLang, email)}
      />
    </div>
  );
};

export default DialogTranzilaPayment;
