import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";
import { useSelectedMessage } from "../hooks/useSelectedMessage";

const Messages = () => {
  const { selectedMessage } = useSelectedMessage();
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if (doc.exists()) {
        const chatData = doc.data();
        if (Array.isArray(chatData.messages)) {
          setMessages(chatData.messages);
        } else {
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
      // doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  return (
    <div
      className="messages"
      style={{
        height: `calc(100% - ${selectedMessage?.id ? 112 + 36 : 112}px)`,
        overflowX: "hidden",
      }}
    >
      {Array.isArray(messages) &&
        messages.map((m) => <Message message={m} key={m.id} />)}
    </div>
  );
};

export default Messages;
