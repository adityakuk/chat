import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import PeopleIcon from "@mui/icons-material/People";
import { useContext, useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { db } from "../firebase.js";
import { onSnapshot, collection, doc } from "firebase/firestore";
import { ChatContext } from "../context/ChatContext.js";
import { AuthContext } from "../context/AuthContext.js";

const ChatsUser = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const usersRef = collection(db, "users");

    // Set up a listener to get real-time updates
    const unsubscribe = onSnapshot(usersRef, (querySnapshot) => {
      const usersData = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        usersData.push(userData);
      });

      setUsers(usersData);
    });

    return () => {
      // Unsubscribe from the listener when the component unmounts
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <ListItemButton sx={{ bgcolor: "#2f2d52" }}>
        <PeopleIcon sx={{ marginRight: 3, color: "white" }} />
        <ListItemText
          sx={{ color: "white", typography: "body2" }}
          primary="All Users"
        />
      </ListItemButton>

      <Divider />

      <Paper
        sx={{
          height: "700px",
          width: "180px",
          overflow: "auto",
        }}
      >
        <Box sx={{ width: "200%", bgcolor: "#2f2d52" }}>
          <List>
            {users.map((user) => (
              <div key={user.uid}>
                <ListItem>
                  <ListItemButton>
                    <Typography sx={{ marginRight: "20px" }}>
                      <img
                        src={user.photoURL}
                        alt=""
                        style={{
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
                        }}
                      />
                    </Typography>
                    <Typography sx={{ color: "white" }}>
                      {user.displayName}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              </div>
            ))}
          </List>
        </Box>
      </Paper>
    </div>
  );
};
export default ChatsUser;
