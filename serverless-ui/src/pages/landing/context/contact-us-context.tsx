import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useReducer,
} from 'react';
import {
  ContactUsFormState,
  formReducer,
  setFieldTypes,
} from '../components/contact-us-dialog/utils';

interface ContextProps {
  children: React.ReactNode;
}

interface ContactUsContextProps {
  isDialogOpen: boolean;
  handleOpenDialog: () => void;
  handleCloseDialog: () => void;
  formState: ContactUsFormState;
  handleChange: (fieldType: setFieldTypes, value: string) => void;
  handleClear: () => void;
  sideBarHandler: (action: string) => void;
}

const ContactUsContext = createContext<ContactUsContextProps>({
  isDialogOpen: false,
  handleOpenDialog: () => {},
  handleCloseDialog: () => {},
  formState: {
    email: '',
    fullName: '',
    message: '',
    subject: '',
    phoneNumber: '',
  },
  handleChange: () => {},
  handleClear: () => {},
  sideBarHandler: () => {},
});

export function useContactUsContext() {
  return useContext(ContactUsContext);
}

export const ContactUsProvider: React.FC<ContextProps> = ({ children }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formState, dispatch] = useReducer(formReducer, {
    fullName: '',
    email: '',
    message: '',
    subject: '',
    phoneNumber: '',
  });

  const handleChange = (fieldType: setFieldTypes, value: string) => {
    dispatch({ type: fieldType, payload: value });
  };

  const handleClear = () => {
    dispatch({ type: setFieldTypes.clear });
  };

  const handleOpenDialog = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    handleClear();
  }, []);

  const sideBarHandler = useCallback(
    (action: string): void => {
      if (action === 'support') handleOpenDialog();
    },
    [handleOpenDialog],
  );

  const contextValue = useMemo(
    () => ({
      isDialogOpen,
      handleOpenDialog,
      handleCloseDialog,
      formState,
      handleChange,
      handleClear,
      sideBarHandler,
    }),
    [isDialogOpen, handleOpenDialog, handleCloseDialog, formState, sideBarHandler],
  );

  return <ContactUsContext.Provider value={contextValue}>{children}</ContactUsContext.Provider>;
};
