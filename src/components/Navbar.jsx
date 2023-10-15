import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { styled, useMediaQuery, useTheme } from "@mui/material";

import MuiAppBar from "@mui/material/AppBar";
import MuiToolbar from "@mui/material/Toolbar";
import MuiTypography from "@mui/material/Typography";

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer - 1,
}));

const Navbar = () => {
  const theme = useTheme();
  const { currentUser } = useContext(AuthContext);

  const openDrawerWidth = theme.spacing(28);
  const closedDrawerWidth = theme.spacing(6);

  const isLargeScreen = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <AppBar position="fixed" sx={{ boxShadow: theme.shadows[0] }}>
      <MuiToolbar
        sx={{
          backgroundColor: theme.palette.background.default,
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[12],
          marginLeft: isLargeScreen ? openDrawerWidth : closedDrawerWidth,
          padding: theme.spacing(1),
        }}
        variant="dense"
        disableGutters
      >
        <MuiTypography>Chat App</MuiTypography>
      </MuiToolbar>
    </AppBar>
    // <div className="navbar">
    //   <span className="logo">Chat App</span>
    //   <div className="user">
    //     <img src={currentUser.photoURL} alt="" />
    //     <span>{currentUser.displayName}</span>
    //     <button onClick={() => signOut(auth)}>logout</button>
    //   </div>
    // </div>
  );
};

export default Navbar;
