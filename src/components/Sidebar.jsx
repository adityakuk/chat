import React from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";

const Sidebar = () => {
  return (
    <div
      className="sidebar"
      style={{
        backgroundColor: "#111B21",
      }}
    >
      <Navbar />
      <Search />
      <Chats />
    </div>
  );
};

export default Sidebar;
