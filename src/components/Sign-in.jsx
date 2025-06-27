import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Image from "../components/Image";
import VBANK from "../image/VBANK.ico";
import "../style/signup.css";

function Signin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);

    try {
      const response = await fetch(
        "https://685eda187b57aebd2afac8e8.mockapi.io/users"
      );

      if (!response.ok) {
        alert("Failed to fetch users");
        return;
      }

      const users = await response.json();
      const matchedUser = users.find(
        (u) => u.email === formData.email && u.password === formData.password
      );

      if (matchedUser) {
        localStorage.setItem("user", JSON.stringify(matchedUser));
        console.log("Login successful:", matchedUser);
        navigate("/home");
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error("Something went wrong:", error);
      alert("Network error or server not responding");
    }
  };

  return (
    <div className="signup-wrapper">
      <form className="signup-container" onSubmit={handleSignin}>
        <Image src={VBANK} alt="VBANK logo" />
        <h2>Welcome To V!</h2>
        <h3>SIGN IN</h3>
        <hr />

        <Input
          type="email"
          placeholder="Email Address *"
          name="email"
          value={formData.email}
          onChange={handleOnChange}
        />
        <Input
          type="password"
          placeholder="Password *"
          name="password"
          value={formData.password}
          onChange={handleOnChange}
        />

        <button type="submit" className="create-account">
          SIGN IN
        </button>

        <p>
          Create account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}

export default Signin;
