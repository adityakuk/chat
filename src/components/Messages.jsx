import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";

const Messages = () => {
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

  console.log(messages);

  return (
    <div className="messages">
      {Array.isArray(messages) &&
        messages.map((m) => <Message message={m} key={m.id} />)}
      {/* {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))} */}
      {/* {message.img && <img src={message.img} alt="" />} */}
    </div>
  );
};

export default Messages;
