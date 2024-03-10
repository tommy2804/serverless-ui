import { ReactNode, createContext, useState } from 'react';

export interface credentialsObj {
  username: string;
  password: string;
  session?: string;
  destination?: string;
  newPassword?: string;
  confirmPassword?: string;
  organizationName?: string;
  email?: string;
}

const initialState = {
  username: '',
  password: '',
  newPassword: '',
};

interface CredentialsContextType {
  credentials: credentialsObj;
  setCredentials: (item: any) => void;
}

export const CredentialsContext = createContext<CredentialsContextType>({
  credentials: initialState,
  setCredentials: () => {},
});

interface credentialsProviderProps {
  children: ReactNode;
}

export const CredentialsProvider = ({ children }: credentialsProviderProps) => {
  const [credentials, setCredentials] = useState<credentialsObj>(initialState);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value: CredentialsContextType = {
    credentials,
    setCredentials,
  };

  return <CredentialsContext.Provider value={value}>{children}</CredentialsContext.Provider>;
};
