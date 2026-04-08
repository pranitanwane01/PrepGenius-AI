
import { useAuth } from "../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import "../../interview/style/Navbar.scss"; // 👈 IMPORTANT

const Navbar = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="navbar">

      <h2 className="navbar-logo" onClick={() => navigate("/")}>
        PrepGenius-AI 🚀
      </h2>

      <div className="navbar-right">
        <span className="navbar-user">Hi, {user?.username}</span>

        <button className="navbar-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

    </div>
  );
};

export default Navbar;