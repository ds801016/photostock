import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { register, reset as userReset } from "../features/authSlice";
import Spinner from "../components/Spinner";
import Alert from "@mui/material/Alert";
import axios from "axios";

const VallidateEmail = () => {
  const [email, setEmail] = useState("");
  const [emailValidated, setEmailValidated] = useState(false);
  const [pageError, setPageError] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [code, setCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);

  const dispatch = useDispatch();
  const {
    user: loggedUser,
    isError,
    message,
    isSuccess,
    isLoading,
  } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const validateEmail = async () => {
    if (email.length > 0) {
      let randCode = Math.floor(Math.random() * 899999 + 100000).toString();
      setCode(randCode);
      setShowCodeInput(true);
      setTimeout(() => {
        setShowCodeInput(false);
        setPageError("Timeout! Please Validate again or resend the mail");
      }, 900000);
      const { data } = await axios.post("/user/validateEmail", {
        randCode,
        email,
      });
    }
  };
  const checkCode = () => {
    if (code == codeInput) {
      setShowCodeInput(false);
      setEmailValidated(true);
    } else {
      setPageError("Wrong Code Please try again");
    }
  };
  const validateCode = (e) => {
    setPageError("");
    if (e.target.value.length <= 6) {
      setCodeInput(e.target.value);
    } else if (e.target.value.length == 6) {
      // setCodeInput(e.target.value);
    }
  };
  const handleInput = (e) => {
    setEmail(e.target.value);
  };

  useEffect(() => {
    if (loggedUser != null) {
      navigate("/");
    }
    setTimeout(() => {
      dispatch(userReset());
    }, 6000);
  }, [loggedUser, isError]);
  useEffect(() => {
    if (location.state.validated && location.state.validated == false) {
      setPageError("Please validate your email first");
    }
  }, []);
  return (
    <div className="container">
      <div>
        {isLoading && <Spinner />}
        <p className="page-heading">Please Validate your email for Sign Up</p>
        {pageError.length > 0 && (
          <Alert className="alert-message" severity="error">
            {pageError}
          </Alert>
        )}
        {isError && message.length > 0 && (
          <Alert className="alert-message" severity="error">
            {message}
          </Alert>
        )}
        <form
          onSubmit={
            emailValidated &&
            navigate("/register", { state: { email, validated: true } })
          }
          className="add-form"
        >
          <input
            name="email"
            onChange={handleInput}
            value={email}
            type="email"
            disabled={showCodeInput || emailValidated}
            placeholder="Please enter your email"
          ></input>

          {showCodeInput && !emailValidated && (
            <>
              <input
                name="codee"
                onChange={validateCode}
                value={codeInput}
                type="text"
                placeholder="Enter the 6 digit code sent on email"
              />
              <button
                type="button"
                disabled={codeInput.length < 6 && true}
                onClick={checkCode}
              >
                Check Code
              </button>
            </>
          )}
          {!showCodeInput && !emailValidated && (
            <button type="button" onClick={validateEmail}>
              Validate Email
            </button>
          )}

          {emailValidated && (
            <input
              className="submit-btn"
              type="submit"
              value="Create Account"
            />
          )}
          {/* <input type="submit">Submit</input> */}
          <NavLink to="/login">Already have an account. Sign In</NavLink>
        </form>
      </div>
    </div>
  );
};

export default VallidateEmail;
