import { useEffect, useState } from "react";
import { db } from "../firebase.js";
import { onSnapshot, collection } from "firebase/firestore";
import ChatSidebar from "../features/chat-sidebar/components/ChatSidebar/ChatSidebar.jsx";

export default function ChatsUser() {
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
    // <div>
    //   {/* <ListItemButton sx={{ bgcolor: "#2f2d52" }}>
    //     <PeopleIcon sx={{ marginRight: 3, color: "white" }} />
    //     <ListItemText
    //       sx={{ color: "white", typography: "body2" }}
    //       primary="All Users"
    //     />
    //   </ListItemButton> */}
    //   <Divider />

    //   <Paper
    //     sx={{
    //       height: "514px",
    //       width: "200px",
    //       overflow: "auto",
    //     }}
    //   >
    //     <Box sx={{ width: "200%", maxWidth: 360, bgcolor: "#2f2d52" }}>
    //       {/* <List>
    //         {users.map((user) => (
    //           <div key={user.uid}>
    //             <ListItem>
    //               <ListItemButton>
    //                 <Typography sx={{ marginRight: "20px" }}>
    //                   <img
    //                     src={user.photoURL}
    //                     alt=""
    //                     style={{
    //                       borderRadius: "50%",
    //                       width: "50px",
    //                       height: "50px",
    //                     }}
    //                   />
    //                 </Typography>
    //                 <Typography sx={{ color: "white" }}>
    //                   {user.displayName}
    //                 </Typography>
    //               </ListItemButton>
    //             </ListItem>
    //           </div>
    //         ))}
    //       </List> */}
    //     </Box>
    //   </Paper>
    // </div>
    <ChatSidebar users={users} />
  );
}
