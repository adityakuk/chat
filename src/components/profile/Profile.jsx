import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

const Profile = () => {
  const [state, setState] = React.useState({
    left: false,
  });

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
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} button>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  return (
    <div>
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer("left", true)}>{"clik this"}</Button>
          <Drawer
            anchor={"left"}
            open={state["left"]}
            onClose={toggleDrawer("left", false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
};
export default Profile;

// import * as React from "react";
// import AppBar from "@mui/material/AppBar";
// import Box from "@mui/material/Box";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import IconButton from "@mui/material/IconButton";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import Grid from "@mui/material/Grid";
// import PersonIcon from "@mui/icons-material/Person";
// import { List, ListItem } from "@mui/material";
// import InfoIcon from "@mui/icons-material/Info";
// import LocalPhoneIcon from "@mui/icons-material/LocalPhone";

// const Profile = () => {
//   return (
//     <div className="container mx-auto">
//       <Box sx={{ flexGrow: 1 }}>
//         <AppBar position="static" sx={{ backgroundColor: "#008069" }}>
//           <Toolbar>
//             <IconButton
//               size="large"
//               edge="start"
//               color="inherit"
//               aria-label="menu"
//               sx={{ mr: 2 }}
//             >
//               <ArrowBackIcon />
//             </IconButton>
//             <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//               Profile
//             </Typography>
//           </Toolbar>
//         </AppBar>
//         <Grid
//           container
//           justifyContent="center"
//           alignItems="center"
//           sx={{
//             height: "20vh",
//           }}
//         >
//           <AccountCircleIcon
//             sx={{
//               fontSize: 200,
//               color: "#CFD8DF",
//             }}
//           />
//         </Grid>
//         <Grid
//           container
//           sx={{
//             height: "20vh",
//             marginLeft: "100px",
//             marginTop: "100px",
//           }}
//         >
//           <Grid sx={{ marginLeft: "100px" }}>
//             <Grid item>
//               <Typography
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                 }}
//               >
//                 <PersonIcon
//                   sx={{ fontSize: 40, color: "#8596A0", marginRight: 8 }}
//                 />
//                 <Typography variant="body4" color="#A8B0B7">
//                   Name
//                   <br />
//                   <Typography variant="body4" color="#1E242C">
//                     Aditya Kumar
//                   </Typography>
//                   <br />
//                   <Typography
//                     variant="body1"
//                     color="#A8B0B7"
//                     sx={{ fontSize: 12 }}
//                   >
//                     This is not your usename or pin. this name will be visible{" "}
//                     <br />
//                     to your WhatsApp contacts.
//                   </Typography>
//                 </Typography>
//               </Typography>
//               <Typography
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginTop: "50px",
//                 }}
//               >
//                 <InfoIcon
//                   sx={{ fontSize: 40, color: "#8596A0", marginRight: 8 }}
//                 />
//                 <Typography variant="body4" color="#A8B0B7">
//                   About
//                   <br />
//                   <Typography variant="body4" color="#1E242C">
//                     Hey there! I am using WhatsApp
//                   </Typography>
//                 </Typography>
//               </Typography>
//               <Typography
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   marginTop: "50px",
//                 }}
//               >
//                 <LocalPhoneIcon
//                   sx={{ fontSize: 40, color: "#8596A0", marginRight: 8 }}
//                 />
//                 <Typography variant="body4" color="#A8B0B7">
//                   Phone
//                   <br />
//                   <Typography variant="body4" color="#1E242C">
//                     +91 9876543210
//                   </Typography>
//                 </Typography>
//               </Typography>
//             </Grid>
//           </Grid>
//         </Grid>
//       </Box>
//     </div>
//   );
// };
// export default Profile;
