import React, { createContext, useContext, useState } from 'react';
import { useMediaQuery } from '@mui/material';

interface ContextProps {
  children: React.ReactNode;
}

interface LandingPageContextProps {
  isNonMobile: boolean;
  activeSection: string;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
}

const LandingPageContext = createContext<LandingPageContextProps>({
  isNonMobile: false,
  activeSection: '',
  setActiveSection: () => {},
});

export const useLandingPageContext = () => useContext(LandingPageContext);

export const LandingPageContextProvider: React.FC<ContextProps> = ({ children }) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const isNonMobile = useMediaQuery('(min-width: 900px)');

  return (
    <LandingPageContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        isNonMobile,
        activeSection,
        setActiveSection,
      }}
    >
      {children}
    </LandingPageContext.Provider>
  );
};
