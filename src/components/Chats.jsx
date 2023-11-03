import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Paper from "@mui/material/Paper";
import { Divider } from "@mui/material";

const Chats = () => {
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <div className="chats">
      <Paper
        sx={{
          height: "100%",
          backgroundColor: "#111B21",
          overflowY: "auto",
        }}
      >
        {Object.entries(chats)
          ?.sort((a, b) => b[1].date - a[1].date)
          .map((chat, index) => (
            <div key={chat[0]}>
              <div
                className="userChat"
                onClick={() => handleSelect(chat[1].userInfo)}
              >
                {chat[1].userInfo ? ( // Check if userInfo is defined
                  <>
                    <img src={chat[1].userInfo.photoURL} alt="" />
                    <div className="userChatInfo">
                      <span>{chat[1].userInfo.displayName}</span>
                      <p>{chat[1].lastMessage?.text}</p>
                    </div>
                  </>
                ) : (
                  // Render an alternative content or message when userInfo is undefined
                  <p>User information not available</p>
                )}
              </div>
              {index !== Object.entries(chats).length - 1 && (
                <Divider
                  sx={{
                    backgroundColor: "#222D34",
                  }}
                />
              )}
            </div>
          ))}
      </Paper>
    </div>
  );
};

export default Chats;
