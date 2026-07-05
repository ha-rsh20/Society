import React from "react";
import { useNavigate } from "react-router-dom";
import Home from "./Home.jsx";
import { AuthenticatedContext } from "../Context/Authenticated.jsx";
import Authentication from "./Authentication.jsx";

function Protected(props) {
  const { authenticated, setAuthenticated } =
    React.useContext(AuthenticatedContext);

  const navigate = useNavigate();

  return authenticated == true ? (
    props.Component.name === "Authentication" ? (
      navigate("/")
    ) : (
      <props.Component />
    )
  ) : (
    <Authentication boxValue="login" />
  );
}

export default Protected;
