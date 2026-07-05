import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthenticatedProvider } from "./Context/Authenticated.jsx";
import { ModeProvider } from "./Context/Mode.jsx";

createRoot(document.getElementById("root")).render(
  //<StrictMode>
  <ModeProvider>
    <AuthenticatedProvider>
      <App />
    </AuthenticatedProvider>
  </ModeProvider>,
  //</StrictMode>,
);
