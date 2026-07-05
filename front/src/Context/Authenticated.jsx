import React from "react";

export const AuthenticatedContext = React.createContext();

export const AuthenticatedProvider = (props) => {
  const [authenticated, setAuthenticated] = React.useState(false);
  return (
    <AuthenticatedContext.Provider value={{ authenticated, setAuthenticated }}>
      {props.children}
    </AuthenticatedContext.Provider>
  );
};
