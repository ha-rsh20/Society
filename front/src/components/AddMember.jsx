import React from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  FormControlLabel,
  TextField,
  Checkbox,
  Button,
  ThemeProvider,
} from "@mui/material";
import { ModeContext } from "../Context/Mode.jsx";
import { darkTheme, whiteTheme } from "../mui_style";
import { ToastContainer, toast } from "react-toastify";

export default function AddMember() {
  const { mode, setMode } = React.useContext(ModeContext);
  const location = useLocation();
  const homeNumber = location.state || 1;
  const navigate = useNavigate();
  const [memberName, setMemberName] = React.useState("");
  const [homeN, setHomeN] = React.useState(homeNumber);
  const [maintenance, setMaintenance] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newMember = {
      homeNumber: homeN,
      memberName: memberName,
      maintenance: maintenance,
    };

    const res = await fetch(import.meta.env.BACKEND_URL + "api/members", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(newMember),
    });

    console.log(newMember);

    if (res.ok) {
      navigate("/");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <form
        style={{
          width: "300px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div className={mode == "Night" ? "auth-dark" : "auth-white"}>
          <ThemeProvider theme={mode == "Night" ? darkTheme : whiteTheme}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <TextField
                type="text"
                variant="outlined"
                label="Member Name"
                placeholder="enter member name"
                style={{ margin: 3 }}
                onChange={(e) => setMemberName(e.target.value)}
              />
              <TextField
                type="number"
                variant="outlined"
                label="Home No."
                placeholder="enter home number"
                style={{ margin: 3 }}
                value={homeN}
                onChange={(e) => setHomeN(e.target.value)}
              />
              <FormControlLabel
                value="bottom"
                control={
                  <Checkbox
                    label="Maintenance"
                    checked={maintenance}
                    onChange={(e) => setMaintenance(e.target.checked)}
                    slotProps={{
                      input: { "aria-label": "controlled" },
                    }}
                  />
                }
                label="maintenance"
                labelPlacement="start"
              ></FormControlLabel>
            </div>
            <Button type="submit" variant="contained" onClick={handleSubmit}>
              Add Member
            </Button>
            <ToastContainer />
          </ThemeProvider>
        </div>
      </form>
    </div>
  );
}
