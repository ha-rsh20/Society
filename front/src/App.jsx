import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Authentication from "./components/Authentication";
import AddMember from "./components/AddMember";
import UpdateMember from "./components/UpdateMember";
import Protected from "./components/Protected";
import PasswordReset from "./components/PasswordReset";
import { AuthenticatedContext } from "./Context/Authenticated.jsx";

function App() {
  const { authenticated, setAuthenticated } =
    React.useContext(AuthenticatedContext);
  useState(() => {
    console.log("Checking authentication status...");

    fetch("http://localhost:4000/auth/me", { credentials: "include" })
      .then((res) => {
        if (res.status === 200) {
          setAuthenticated(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<Protected Component={Authentication} boxValue="login" />}
          />
          <Route
            path="/register"
            element={
              <Protected Component={Authentication} boxValue="register" />
            }
          />
          <Route path="/password/reset" element={<PasswordReset />} />
          <Route
            path="/addMember"
            element={<Protected Component={AddMember} />}
          />
          <Route
            path="/updateMember"
            element={<Protected Component={UpdateMember} />}
          />
          <Route path="/protected" element={<Protected />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
