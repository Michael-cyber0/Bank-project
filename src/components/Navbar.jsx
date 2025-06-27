import Person from "../image/Person.png";
import bell from "../image/bell.svg";
import scan from "../image/scan.svg";
import headset from "../image/headset.svg";
import "../style/navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <img src={Person} alt="bank logo" />
          <span>Hi, Michael</span>
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
