import React from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import SelectedMessageProvider from "../context/SelectedMessage";

const Home = () => {
  return (
    <div className="home">
      <div className="container">
        {/* <ChatsUser /> */}
        <Sidebar />
        <SelectedMessageProvider>
          <Chat />
        </SelectedMessageProvider>
      </div>
    </div>
  );
};

export default Home;
