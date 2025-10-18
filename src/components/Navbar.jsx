import bell from "../image/bell.svg";
import scan from "../image/scan.svg";
import headset from "../image/headset.svg";
import "../style/navbar.css";

const Navbar = () => {
  // Get user info from localStorage safely
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <div className="dashboard">
            <span>Hi, {user ? `${user.firstname}` : "Guest"}</span>
          </div>
        </div>

        <div className="help-logos">
          <img src={headset} alt="help logo" />
          <img src={scan} alt="scan logo" />
          <img src={bell} alt="notification logo" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
