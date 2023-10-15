import React from "react";
import Chat from "../components/Chat";
import ChatsUser from "../components/ChatsUser";
import Sidebar from "../components/Sidebar";

import MuiBox from "@mui/material/Box";
import MuiGrid from "@mui/material/Grid";

// sidebar

const Home = () => {
  return (
    // <div className="home">
    <MuiBox width="100vw" height="100vh">
      <ChatsUser />
      <MuiGrid container>
        <Sidebar />
        <Chat />
      </MuiGrid>
      {/* <ChatsUser />
      <div className="container">
      </div> */}
    </MuiBox>
    // </div>
  );
};

export default Home;
