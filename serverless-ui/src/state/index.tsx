import { LoginStateProvider } from "./login-context";
import { ToasterProvider } from "./toaster-context";
import { AuthProvider } from "./auth-context";
import { DialogProvider } from "./dialog-context";
import { IzmeDialogProvider } from "./general-dialog-context";
import { ContactUsProvider } from "../pages/landing/context/contact-us-context";

interface ContextProps {
  children: React.ReactNode;
}
const ContextProvider: React.FC<ContextProps> = ({ children }) => (
  <LoginStateProvider>
    <ToasterProvider>
      <DialogProvider>
        <IzmeDialogProvider>
          <ContactUsProvider>{children}</ContactUsProvider>
        </IzmeDialogProvider>
      </DialogProvider>
    </ToasterProvider>
  </LoginStateProvider>
);

export default ContextProvider;
