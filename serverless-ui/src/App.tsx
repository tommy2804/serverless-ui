import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import Auth from "./pages/auth/auth";

function App() {
  const currentToken = localStorage.getItem("userToken");

  const AuthWrapper = () => {
    return currentToken ? <Navigate to="/" replace /> : <Auth />;
  };

  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<HomeWrapper />} /> */}
        <Route path="/auth" element={<AuthWrapper />} />
      </Routes>
    </Router>
  );
}

export default App;
