import { createContext, useContext, useState, useCallback } from "react";

export interface IzmeCustomDialogProps {
  customComponent: React.ReactNode;
}

export interface IzmeDialogProps {
  type: "success" | "warning" | "error";
  title: string;
  message: string;
  primaryButton: string;
  primaryButtonAction: () => void;
  secondaryButton?: string;
  secondaryButtonAction?: () => void;
}

type IzmeDialog = IzmeDialogProps | IzmeCustomDialogProps;

interface IzmeDialogContextProps {
  dialogProps: IzmeDialog | null;
  setDialogProps: (props: IzmeDialog) => void;
  onClose: () => void;
}

const IzmeDialogContext = createContext<IzmeDialogContextProps>({
  dialogProps: null,
  setDialogProps: () => {},
  onClose: () => {},
});

export const useIzmeDialogContext = () => useContext<IzmeDialogContextProps>(IzmeDialogContext);

export const IzmeDialogProvider = ({ children }: any) => {
  const [dialogProps, setDialogProps] = useState<IzmeDialog | null>(null);

  const onClose = useCallback(() => setDialogProps(null), []);

  return (
    <IzmeDialogContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        setDialogProps,
        onClose,
        dialogProps,
      }}>
      {children}
    </IzmeDialogContext.Provider>
  );
};
