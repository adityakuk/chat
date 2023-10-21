import React, { useContext, useEffect, useState } from "react";
// import { signOut } from "firebase/auth";
// import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import AddCommentIcon from "@mui/icons-material/AddComment";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { db } from "../firebase.js";
import { collection, onSnapshot } from "firebase/firestore";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [state, setState] = React.useState({
    left: false,
  });

  useEffect(() => {
    const userRef = collection(db, "users");

    const unsubscribe = onSnapshot(userRef, (QuerySnapshot) => {
      const usersData = [];
      QuerySnapshot.forEach((doc) => {
        const userData = doc.data();
        usersData.push(userData);
      });

      setUsers(usersData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <>
      <Box
        sx={{
          overflowY: "hidden",
          width: anchor === "top" || anchor === "bottom" ? "auto" : 400,
        }}
        role="presentation"
        // onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
      >
        <ListItem
          className="new-chat-item"
          sx={{
            backgroundColor: "#202C33",
            "&:hover": {
              backgroundColor: "#202C33",
            },
            position: "sticky",
            top: 0,
          }}
        >
          <ListItemIcon onClick={toggleDrawer("left", false)}>
            <ArrowBackIcon
              sx={{
                color: "white",
                cursor: "pointer",
              }}
            />
          </ListItemIcon>
          <ListItemText
            sx={{
              color: "white",
              typography: "body2",
            }}
            primary="New Chat"
          />
        </ListItem>
        <Divider />
        <Box
          sx={{
            height: "calc(100% - 50px)",
            overflowY: "auto",
            backgroundColor: "#111B21",
          }}
        >
          <List>
            {users.map((user) => (
              <ListItem button key={user.uid}>
                <Divider />
                <ListItemIcon>
                  <img
                    src={user.photoURL}
                    alt=""
                    style={{
                      borderRadius: "50%",
                      width: "50px",
                      height: "50px",
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  sx={{
                    color: "white",
                    typography: "body2",
                  }}
                  primary={user.displayName}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </>
  );

  return (
    <>
      <div className="navbar">
        <div className="user">
          <img src={currentUser.photoURL} alt="" />
          <span className="display-name">{currentUser.displayName}</span>
        </div>
        <Typography
          sx={{
            alignItems: "center",
            marginLeft: "250px",
            "&:hover": {
              cursor: "pointer",
            },
          }}
        >
          {["left"].map((anchor) => (
            <React.Fragment key={anchor}>
              <Button onClick={toggleDrawer("left", true)}>
                <AddCommentIcon
                  sx={{
                    color: "white",
                  }}
                />
              </Button>
              <Drawer
                anchor={"left"}
                open={state["left"]}
                //onClose={toggleDrawer("left", false)}
              >
                {list(anchor)}
              </Drawer>
            </React.Fragment>
          ))}
        </Typography>
      </div>
    </>
  );
};

export default Navbar;
{
  /* <Button
          variant="contained"
          sx={{
            color: "white",
            backgroundColor: "red",
            "&:hover": {
              backgroundColor: "red",
            },
            width: "auto",
            height: "auto",
          }}
          size="small"
          onClick={() => signOut(auth)}
        >
          logout
        </Button> */
}
{
  /* <button onClick={() => signOut(auth)}>logout</button> */
}
