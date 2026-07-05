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

function UpdateMember() {
  const { mode, setMode } = React.useContext(ModeContext);
  const location = useLocation();
  const member = location.state;
  const navigate = useNavigate();
  const [memberName, setMemberName] = React.useState(member.memberName);
  const [homeN, setHomeN] = React.useState(member.homeNumber);
  const [maintenance, setMaintenance] = React.useState(member.maintenance);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedMember = {
      homeNumber: homeN,
      memberName: memberName,
      maintenance: maintenance,
    };

    const res = await fetch(
      `http://localhost:4000/api/members/${member.homeNumber}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedMember),
      },
    );

    console.log(updatedMember);

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
                value={memberName}
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
              Update
            </Button>
            <ToastContainer />
          </ThemeProvider>
        </div>
      </form>
    </div>
  );
}

export default UpdateMember;
