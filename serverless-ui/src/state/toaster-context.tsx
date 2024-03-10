import { createContext, useContext, useState, useCallback } from "react";

export interface ToasterProps {
  type: "success" | "error";
  text: string;
  buttonText?: string;
  primaryButtonAction?: () => void;
}

interface ToasterContextProps {
  toasterProps: ToasterProps | null;
  setToasterProps: (props: ToasterProps) => void;
  onClose: () => void;
}

const ToasterContext = createContext<ToasterContextProps>({
  toasterProps: null,
  setToasterProps: () => {},
  onClose: () => {},
});

export const useToasterContext = () => useContext<ToasterContextProps>(ToasterContext);

export const ToasterProvider = ({ children }: any) => {
  const [toasterProps, setToasterProps] = useState<ToasterProps | null>(null);

  const onClose = useCallback(() => setToasterProps(null), []);

  return (
    <ToasterContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        setToasterProps,
        onClose,
        toasterProps,
      }}>
      {children}
    </ToasterContext.Provider>
  );
};
