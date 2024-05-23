import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import useGlobalMuiTheme from "./shared/styles/useGlobalMuiTheme";
import { useLoginStateContext } from "./state/login-context";
import Routers from "./utils/routers";
import "./App.scss";
import "../i18n/i18n";
import CreateEventDialog from "./components/create-event-dialog";
import ContactUsDialog from "./pages/landing/components/contact-us-dialog";
import { DialogMinimized } from "./components/create-event-dialog/components";
import { useDialogContext } from "./state/dialog-context";
import IzmeToaster from "./shared/toaster/izme-toaster";
import IzmeDialog from "./shared/dialog/izme-dialog";

function App() {
  const theme = useGlobalMuiTheme();
  const { authState } = useLoginStateContext();
  const { isComponentMinimized } = useDialogContext();

  return (
    <ThemeProvider theme={theme}>
      <IzmeDialog />
      <IzmeToaster />
      <CreateEventDialog />
      <ContactUsDialog />
      {isComponentMinimized ? <DialogMinimized /> : null}
      <BrowserRouter>
        <Routers authState={authState} />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
