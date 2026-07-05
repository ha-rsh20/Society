import React, { useEffect, useState } from "react";

export const ModeContext = React.createContext();

export const ModeProvider = (props) => {
  const [mode, setMode] = useState("Light");

  useEffect(() => {
    const theme = mode === "Night" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
  }, [mode]);

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {props.children}
    </ModeContext.Provider>
  );
};
