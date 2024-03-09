import { LoginStateProvider } from "./login-context";
import { ToasterProvider } from "./toaster-context";
import { AuthProvider } from "./auth-context";

interface ContextProps {
  children: React.ReactNode;
}
const ContextProvider: React.FC<ContextProps> = ({ children }) => (
  <LoginStateProvider>
    <AuthProvider>
      <ToasterProvider>{children}</ToasterProvider>
    </AuthProvider>
  </LoginStateProvider>
);

export default ContextProvider;
