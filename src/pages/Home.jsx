import React from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import ChatsUser from "../components/ChatsUser";

const Home = () => {
  return (
    <div className="home">
      <div className="container">
        {/* <ChatsUser /> */}
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
};

export default Home;
