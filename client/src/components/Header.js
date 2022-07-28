import { useNavigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authSlice";
import { useState } from "react";
import { profile } from "../features/authSlice";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const handleLogout = () => {
    handleClose();
    dispatch(logout());
    navigate("/login");
  };

  //drawer code
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const open1 = Boolean(anchorEl1);
  const open2 = Boolean(anchorEl2);
  const handleClick = (event, anchor) => {
    console.log(anchor);
    if (anchor == 1) {
      setAnchorEl1(event.currentTarget);
    } else if (anchor == 2) {
      setAnchorEl2(event.currentTarget);
    }
  };
  const handleClose = (anchor) => {
    if (anchor == 1) {
      setAnchorEl1(null);
    } else if (anchor == 2) {
      setAnchorEl2(null);
    }
  };
  //drawer code ends

  useState(() => {
    dispatch(profile());
  }, []);
  return (
    <div className="header">
      <ThemeProvider theme={darkTheme}>
        <NavLink className="mainHeading" to="/">
          PHOTOSTOCK
        </NavLink>
        <div className="header-menu btn-div">
          <NavLink to="/">Home</NavLink>
          {!user ? (
            <>
              {" "}
              <NavLink to="/login">Login</NavLink>
            </>
          ) : (
            <>
              <Button
                id="basic-button-1"
                aria-controls={open1 ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open1 ? "true" : undefined}
                onClick={(event) => handleClick(event, 1)}
                className="menu-button"
              >
                <p>{user.firstName}</p>
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl1}
                open={open1}
                onClose={() => handleClose(1)}
              >
                <MenuItem className="header-menu-item" onClick={handleClose}>
                  <NavLink to={`/profile/${user.userId}/favPhotos`}>
                    Liked Photos
                  </NavLink>
                </MenuItem>

                <MenuItem className="header-menu-item" onClick={handleClose}>
                  <NavLink to={`/profile/${user.userId}`}>Profile</NavLink>
                </MenuItem>
                <MenuItem className="header-menu-item" onClick={handleClose}>
                  {/* <button to="/logout"> */}
                  <p onClick={handleLogout}>Logout</p>
                  {/* </button> */}
                </MenuItem>
              </Menu>
            </>
          )}
        </div>
        <div className="header-menu-compact">
          <Button
            className="compact-menu-button"
            id="basic-button"
            aria-controls={open2 ? "basic-menu-1" : undefined}
            aria-haspopup="true"
            aria-expanded={open2 ? "true" : undefined}
            onClick={(event) => handleClick(event, 2)}
          >
            <div className="hamburger-menu">
              <div className="hamburger-1"></div>
              <div className="hamburger-2"></div>
              <div className="hamburger-3"></div>
            </div>
          </Button>
          <Menu
            id="basic-menu-1"
            anchorEl={anchorEl2}
            open={open2}
            onClose={() => handleClose(2)}
          >
            {!user ? (
              <div>
                {" "}
                <MenuItem className="header-menu-item" onClick={handleClose}>
                  <NavLink to="/login">Login</NavLink>
                </MenuItem>
              </div>
            ) : (
              <div>
                <MenuItem className="header-menu-item" onClick={handleClose}>
                  <NavLink to={`/profile/${user.userId}/favPhotos`}>
                    Liked Photos
                  </NavLink>
                </MenuItem>
                <MenuItem className="header-menu-item" onClick={handleClose}>
                  <NavLink to={`/profile/${user.userId}`}>
                    {user.firstName}
                  </NavLink>
                </MenuItem>
                <MenuItem className="header-menu-item" onClick={handleLogout}>
                  {" "}
                  <p>Logout</p>
                </MenuItem>
              </div>
            )}
          </Menu>
        </div>
      </ThemeProvider>
    </div>
  );
};

export default Header;
