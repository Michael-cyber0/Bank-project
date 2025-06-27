import "../style/signup.css";
import Input from "../components/Input";
import React, { useState } from "react";
import Image from "../components/Image";
import VBANK from "../image/VBANK.ico";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    try {
      const response = await fetch(
        "https://685eda187b57aebd2afac8e8.mockapi.io/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        alert("Signup failed. Please try again.");
        return;
      }

      const newUser = await response.json();
      localStorage.setItem("user", JSON.stringify(newUser));

      await fetch("https://685eda187b57aebd2afac8e8.mockapi.io/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: newUser.id, balance: 2000 }),
      });

      alert("Signup successful!");
      navigate("/signin");
    } catch (error) {
      console.error("Something went wrong:", error);
      alert("Network error or wrong code.");
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="signup-wrapper">
      <form className="signup-container" onSubmit={handleSignup}>
        <Image src={VBANK} alt="VBANK logo" />
        <h3>CREATE AN ACCOUNT WITH US</h3>
        <hr />
        <h4>Personal Information</h4>

        <Input
          type="text"
          placeholder="First Name *"
          name="firstname"
          value={formData.firstname}
          onChange={handleOnChange}
        />
        <Input
          type="text"
          placeholder="Last Name *"
          name="lastname"
          value={formData.lastname}
          onChange={handleOnChange}
        />
        <Input
          type="email"
          placeholder="Email Address *"
          name="email"
          value={formData.email}
          onChange={handleOnChange}
        />
        <Input
          type="number"
          placeholder="Phone Number *"
          name="phone"
          value={formData.phone}
          onChange={handleOnChange}
        />
        <Input
          type="password"
          placeholder="Password *"
          name="password"
          value={formData.password}
          onChange={handleOnChange}
        />

        <button className="create-account" type="submit">
          CREATE ACCOUNT
        </button>
        <p>
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
