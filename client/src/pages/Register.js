import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { register, reset as userReset } from "../features/authSlice";
import Spinner from "../components/Spinner";
import Alert from "@mui/material/Alert";

const Register = () => {
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  // const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const {
    user: loggedUser,
    isError,
    message,
    isSuccess,
    isLoading,
  } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const handleInput = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(register(newUser));
  };
  // const toggleShowwPassword = () => {
  //   setShowPassword(!showPassword);
  // };
  useEffect(() => {
    if (loggedUser != null) {
      navigate("/");
    }
    setTimeout(() => {
      dispatch(userReset());
    }, 6000);
  }, [loggedUser, isError]);
  return (
    <div className="container">
      <div>
        {isLoading && <Spinner />}
        <p className="page-heading">Please Sign Up to upload photos</p>
        {isError && message.length > 0 && (
          <Alert className="alert-message" severity="error">
            {message}
          </Alert>
        )}
        <form onSubmit={handleRegister} className="add-form">
          <input
            name="firstName"
            onChange={handleInput}
            value={newUser.firstName}
            type="text"
            placeholder="Please enter your first name"
          />
          <input
            name="lastName"
            onChange={handleInput}
            value={newUser.lastName}
            type="text"
            placeholder="Please enter your last name"
          ></input>
          <input
            name="email"
            onChange={handleInput}
            value={newUser.email}
            type="email"
            placeholder="Please enter your email"
          ></input>
          <input
            name="password"
            onChange={handleInput}
            value={newUser.password}
            type={showPassword ? "text" : "password"}
            placeholder="Please enter your password"
          ></input>

          <button>Submit</button>
          <NavLink to="/login">Already have an account. Sign In</NavLink>
        </form>
      </div>
    </div>
  );
};

export default Register;
