import { useNavigate } from "react-router-dom";
import ArrowForward from "@mui/icons-material/ArrowForward";
import "./back-to-login.scss";

const BackToLogin = () => {
  const navigate = useNavigate();
  const handleNavigate = () => navigate("/sign-in");

  return (
    <button className={`back-to-login-btn flex-row-reverse' }`} onClick={handleNavigate}>
      <ArrowForward className='back-to-login-arrow' />
      {"back-to-log-in"}
    </button>
  );
};

export default BackToLogin;
