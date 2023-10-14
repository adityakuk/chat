import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import PeopleIcon from "@mui/icons-material/People";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { db } from "../firebase.js";
import { onSnapshot, collection } from "firebase/firestore";

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
      <Paper
        sx={{
          height: "560px",
          width: "200px",
          overflow: "auto",
          backgroundColor: "",
        }}
      >
        <Box sx={{ width: "200%", maxWidth: 360, bgcolor: "#2f2d52" }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <PeopleIcon sx={{ marginRight: 3 }} />
                <ListItemText
                  sx={{ color: "white", typography: "body2" }}
                  primary="All Users"
                />
              </ListItemButton>
            </ListItem>
            <Divider />
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
