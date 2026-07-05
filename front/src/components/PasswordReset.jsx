import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import { Button, ThemeProvider } from "@mui/material";
import { darkTheme, whiteTheme } from "../mui_style";
import { ModeContext } from "../Context/Mode.jsx";

function PasswordReset(props) {
  const { mode, setMode } = React.useContext(ModeContext);
  const { cemail } = useLocation();
  const [email, setEmail] = useState(cemail);
  const [otp, setOTP] = useState();
  const [sOTP, setSOTP] = useState(false);
  const [emailAuth, setEmailAuth] = useState(false);
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  const getPasswordChangeOTP = (e) => {
    e.preventDefault();

    fetch(import.meta.env.VITE_BACKEND_URL + `auth/sendMail/${email}/1`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 200) {
          setSOTP(true);
          toast.success("Check your mail, OTP sent for password change!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else if (res.status === 204) {
          toast.error("Email not found!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      })
      .catch((err) => {
        toast.error("OTP not sent", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  const verifyOTP = (e) => {
    e.preventDefault();

    fetch(import.meta.env.VITE_BACKEND_URL + `auth/verifyOTP`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ otp }),
    })
      .then((res) => {
        if (res.status === 200) {
          setOTP("");
          setPassword("");
          setEmailAuth(true);
        }
      })
      .catch((err) => {
        toast.error("Invalid OTP!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  const resetPassword = (e) => {
    e.preventDefault();
    let credential = {
      email: email,
      password: password,
    };

    fetch(import.meta.env.VITE_BACKEND_URL + "auth/password/reset", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(credential),
    })
      .then((res) => {
        if (res.status === 201) {
          toast.success("Password changed!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        }
      })
      .catch((err) => {
        toast.error("Failed to reset password!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  return (
    <div>
      <form>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyItems: "center",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <div
            className={mode == "Night" ? "auth-dark reset" : "auth-white reset"}
          >
            <ThemeProvider theme={mode === "dark" ? darkTheme : whiteTheme}>
              <TextField
                type="email"
                variant="outlined"
                label="Email"
                placeholder="enter email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
              />
              {sOTP && !emailAuth && (
                <TextField
                  type="text"
                  variant="outlined"
                  label="OTP"
                  placeholder="enter OTP"
                  value={otp}
                  onChange={(e) => {
                    setOTP(e.target.value);
                  }}
                  required
                />
              )}
              {emailAuth && (
                <TextField
                  type="password"
                  variant="outlined"
                  label="Password"
                  placeholder="enter password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  required
                />
              )}
              <Button
                variant="contained"
                onClick={
                  !sOTP
                    ? getPasswordChangeOTP
                    : emailAuth
                      ? resetPassword
                      : verifyOTP
                }
                type="submit"
                style={{ margin: 10 }}
              >
                {!sOTP ? "Get OTP" : emailAuth ? "Reset" : "Verify"}
              </Button>
            </ThemeProvider>
          </div>
          <ToastContainer />
        </div>
      </form>
    </div>
  );
}

export default PasswordReset;
