import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticatedContext } from "../Context/Authenticated.jsx";
import { Button } from "@mui/material";

function Home() {
  const { authenticated, setAuthenticated } =
    React.useContext(AuthenticatedContext);
  const [members, setMembers] = React.useState([]);
  const navigate = useNavigate();

  const handleAddMember = (e) => {
    e.preventDefault();
    navigate("/addMember", { state: members.length + 1 });
  };

  const handleUpdateMember = (member) => {
    navigate("/updateMember", { state: member });
  };

  const handleDeleteMember = (member) => {
    fetch(
      import.meta.env.VITE_BACKEND_URL + `api/members/${member.homeNumber}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    )
      .then((res) => res.json())
      .then((data) => {
        setMembers((prevMembers) =>
          prevMembers.filter((m) => m.homeNumber !== member.homeNumber),
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    fetch(import.meta.env.VITE_BACKEND_URL + "api/members", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setMembers(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="home">
      <div>
        <h1>List of Members</h1>
      </div>
      {authenticated == true ? (
        <div>
          {members &&
            members.map((member, index) => (
              <div key={index}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "20px",
                    border: "1px solid black",
                    padding: "10px",
                  }}
                >
                  <p>Home: {member.homeNumber}</p>
                  <h2>{member.memberName}</h2>
                  <p>
                    Maintenance: {member.maintenance === true ? "Yes" : "No"}
                  </p>
                  <Button
                    type="submit"
                    variant="contained"
                    onClick={handleUpdateMember.bind(this, member)}
                    style={{ marginTop: 10, marginBottom: 10, marginLeft: 10 }}
                  >
                    Update
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    onClick={handleDeleteMember.bind(this, member)}
                    style={{ marginTop: 10, marginBottom: 10, marginRight: 10 }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          <Button
            type="submit"
            variant="contained"
            onClick={handleAddMember}
            style={{ margin: 10 }}
          >
            Add Member
          </Button>
        </div>
      ) : (
        <div>
          <p>Please log in to view members.</p>
        </div>
      )}
    </div>
  );
}

export default Home;
