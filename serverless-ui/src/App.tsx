import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import useGlobalMuiTheme from "./shared/styles/useGlobalMuiTheme";
import { useLoginStateContext } from "./state/login-context";
import Routers from "./utils/routers";
import "./App.scss";
import "../i18n/i18n";

function App() {
  const theme = useGlobalMuiTheme();
  const { authState } = useLoginStateContext();

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routers authState={authState} />
      </Router>
    </ThemeProvider>
  );
}

export default App;
