import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import "./App.scss";
import useGlobalMuiTheme from "./shared/styles/useGlobalMuiTheme";
import { useLoginStateContext } from "./state/login-context";
import Routers from "./utils/routers";

function App() {
  // const currentToken = localStorage.getItem("userToken");

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
