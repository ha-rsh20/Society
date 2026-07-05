import React from "react";
import { AuthenticatedContext } from "../Context/Authenticated.jsx";
import { ModeContext } from "../Context/Mode.jsx";
import NightlightIcon from "@mui/icons-material/Nightlight";
import LightModeIcon from "@mui/icons-material/LightMode";
import Cookies from "js-cookie";

function Navbar() {
  const { authenticated, setAuthenticated } =
    React.useContext(AuthenticatedContext);

  const { mode, setMode } = React.useContext(ModeContext);

  const toggleMode = () => {
    if (mode == "Light") {
      setMode("Night");
    } else {
      setMode("Light");
    }
  };

  const handleLogout = () => {
    fetch("http://localhost:4000/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }).catch((err) => {
      console.log(err);
    });
    setAuthenticated(false);
  };

  return (
    <div className="navbar">
      <div className="navbar-custom">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span>
            {mode == "Light" ? (
              <NightlightIcon onClick={toggleMode} />
            ) : (
              <LightModeIcon onClick={toggleMode} />
            )}
          </span>
          <span>
            {authenticated == false ? (
              <a href="/login" className="navbar-logo">
                Login/Register
              </a>
            ) : (
              <a
                href="/"
                onClick={() => {
                  handleLogout();
                }}
                className="navbar-logo"
              >
                Logout
              </a>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
