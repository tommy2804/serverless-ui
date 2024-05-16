import { Dialog, IconButton, useMediaQuery } from '@mui/material';
import React, { useState, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Close } from '@mui/icons-material';
import './styles.scss';
import ContactUsContent from './components/content';
import { useContactUsContext } from '../../context/contact-us-context';
import { contactUsSxStyles } from './sx-styles';
import ContactUsForm from './components/form/contact-us-form';
import ContactUsSuccess from './components/content/success-page';

const ContactUsDialog: React.FC = () => {
  const [isSendSuccess, setIsSendSuccess] = useState(false);
  const { isDialogOpen, handleCloseDialog } = useContactUsContext();
  const isNonMobile = useMediaQuery('(min-width:650px)');
  const { i18n } = useTranslation();

  useEffect(() => {
    if (isDialogOpen) {
      setIsSendSuccess(false);
    }
  }, [isDialogOpen]);

  return (
    <Suspense>
      <div>
        {isDialogOpen && (
          <Dialog
            open={isDialogOpen}
            sx={contactUsSxStyles.flexCenter}
            onClose={handleCloseDialog}
            keepMounted
            maxWidth="lg"
          >
            <div className="dialog-contact-us-container">
              <ContactUsContent />
              <div className={`dialog-close-icon${i18n.dir() === 'rtl' ? '-rtl' : ''}`}>
                <IconButton
                  size="small"
                  edge="start"
                  color="inherit"
                  onClick={handleCloseDialog}
                  aria-label="close"
                >
                  <Close />
                </IconButton>
              </div>
              {isSendSuccess ? (
                <ContactUsSuccess />
              ) : (
                <ContactUsForm isNonMobile={isNonMobile} setIsSendSuccess={setIsSendSuccess} />
              )}
            </div>
          </Dialog>
        )}
      </div>
    </Suspense>
  );
};

export default ContactUsDialog;
