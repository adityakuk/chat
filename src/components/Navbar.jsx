import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Button from "@mui/material/Button";
import { TextField, Typography } from "@mui/material";
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
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { ChatContext } from "../context/ChatContext";

const Navbar = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [err, setErr] = useState(false);
  const [state, setState] = React.useState({
    left: false,
  });

  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const userRef = collection(db, "users");

    const unsubscribe = onSnapshot(userRef, (QuerySnapshot) => {
      const usersData = [];
      QuerySnapshot.forEach((doc) => {
        const userData = doc.data();
        usersData.push(userData);
      });

      setUsers(usersData);
      setFilteredUsers(usersData);
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

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = async (user) => {
    setErr(false); // Reset error state

    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      console.log("Calling handleSelect with combinedId:", combinedId);

      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        console.log("Chat does not exist, creating it...");

        // Create a chat in the "chats" collection
        await setDoc(doc(db, "chats", combinedId), {});

        // Create/update user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId]: {
            userInfo: {
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL,
            },
            date: serverTimestamp(),
          },
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId]: {
            userInfo: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            },
            date: serverTimestamp(),
          },
        });
      }
    } catch (err) {
      console.error("Error in handleSelect:", err);
    }

    // setUser(null);
    // setUsername("");
  };

  const onChangeSearch = (e) => {
    const text = e.target.value;
    setSearchText(text);

    // searching
    const filtered = users.filter(({ displayName }) =>
      displayName.toLowerCase().includes(text.toLowerCase())
    );

    setFilteredUsers(filtered);
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
        // onKeyDown={toggleDrawer(anchor, false)}
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
            <ArrowBackIcon sx={{ color: "white", cursor: "pointer" }} />
          </ListItemIcon>
          <ListItemText
            sx={{ color: "white", typography: "body2" }}
            primary="New Chat"
          />
        </ListItem>
        <Divider />
        <Box
          sx={{
            height: "100vh",
            overflowY: "auto",
            backgroundColor: "#111B21",
          }}
        >
          <List>
            <TextField
              label="Search User"
              variant="outlined"
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ sx: { border: "1px solid blue", width: "400px" } }}
              onChange={onChangeSearch}
              value={searchText}
              sx={{ backgroundColor: "#202C33" }}
            />
            {filteredUsers.map((user) => (
              <Box
                onClick={toggleDrawer("left", false)}
                sx={{ cursor: "pointer" }}
              >
                <ListItem
                  key={user.uid}
                  onClick={() => {
                    handleSelect(user);
                  }}
                  sx={{
                    ":hover": {
                      backgroundColor: "#090a0f",
                    },
                  }}
                >
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
                    sx={{ color: "white", typography: "body2" }}
                    primary={user.displayName}
                  />
                </ListItem>
              </Box>
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
                <AddCommentIcon sx={{ color: "white" }} />
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
