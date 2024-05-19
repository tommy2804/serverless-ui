import { LoginStateProvider } from "./login-context";
import { ToasterProvider } from "./toaster-context";
import { AuthProvider } from "./auth-context";
import { SettingsProvider } from "./SettingsContext";

interface ContextProps {
  children: React.ReactNode;
}
const ContextProvider: React.FC<ContextProps> = ({ children }) => (
  <LoginStateProvider>
    <SettingsProvider>
      <AuthProvider>
        <ToasterProvider>{children}</ToasterProvider>
      </AuthProvider>{" "}
    </SettingsProvider>
  </LoginStateProvider>
);

export default ContextProvider;
