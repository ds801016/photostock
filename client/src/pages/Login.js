import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { login, reset as userReset } from "../features/authSlice";
import Spinner from "../components/Spinner";
import Alert from "@mui/material/Alert";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const {
    user: loggedUser,
    isSuccess,
    isError,
    message,
    isLoading,
  } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login(user));
  };
  const handleInput = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
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
        <p className="page-heading">Please Login to upload photos</p>
        {isError && message.length > 0 && (
          <Alert className="alert-message" severity="error">
            {message}
          </Alert>
        )}
        <form onSubmit={handleLogin} className="add-form">
          <input
            name="email"
            onChange={handleInput}
            value={user.email}
            type="email"
            placeholder="Please enter your email"
          ></input>
          <input
            name="password"
            onChange={handleInput}
            value={user.password}
            type="password"
            placeholder="Please enter your password"
          ></input>
          <button>Login</button>
          <NavLink to="/register">Don't have an account. Sign Up</NavLink>
        </form>
      </div>
    </div>
  );
};

export default Login;
