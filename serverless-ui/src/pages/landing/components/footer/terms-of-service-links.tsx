import React, { Fragment } from "react";
import { Button } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useTranslation } from "react-i18next";

const TermsOfServiceLinks = () => {
  const { t } = useTranslation();

  const linkClickHandler = (file: PoliciesFiles) => {
    dialogOpenHandler(file);
  };
  const linksRenderer = () =>
    Object.values(PoliciesFiles).map((file: PoliciesFiles, index: number) => (
      <Fragment key={index}>
        <Button key={file} className='policy-menu-btn' onClick={() => linkClickHandler(file)}>
          {t(file.replace(".pdf", ""))}
        </Button>
        {index !== Object.values(PoliciesFiles).length - 1 && (
          <Divider flexItem={true} orientation='vertical' />
        )}
      </Fragment>
    ));

  return <div className='legal-container'>{linksRenderer()}</div>;
};

export default TermsOfServiceLinks;
