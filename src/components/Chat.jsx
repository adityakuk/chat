import React, { useContext } from "react";
import Cam from "../img/cam.png";
import Add from "../img/add.png";
// import More from "../img/more.png";
import Messages from "./Messages";
import LogoutIcon from "@mui/icons-material/Logout";
import Input from "./Input";
import { Divider, Tooltip } from "@mui/material";
import { ChatContext } from "../context/ChatContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          <img src={Cam} alt="" />
          <img src={Add} alt="" />
          <Tooltip title="Logout User" arrow style={{ cursor: "pointer" }}>
            <LogoutIcon onClick={() => signOut(auth)} />
          </Tooltip>
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
