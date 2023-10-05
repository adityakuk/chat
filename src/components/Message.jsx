import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const isSender = message.senderId === currentUser.uid;

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
    setMenuOpen(true);
  };

  const handleEditClick = async () => {
    const newText = prompt("Edit the message:", message.text);

    if (newText !== null && newText !== message.text) {
      try {
        // Create a Firestore document reference for the message
        const messageDocRef = doc(
          db,
          "chats",
          data.chatId,
          "messages",
          message.id
        );
        const docSnapshot = await getDoc(messageDocRef);
        if (docSnapshot.exists()) {
          await updateDoc(messageDocRef, {
            text: newText,
          });
          console.log("Message Updated Successfully");
        } else {
          console.error("Document does not exist:", message.id);
        }
      } catch (error) {
        console.log("Error Updating messages:", error);
      }
    }
  };

  const handleMenuClose = async () => {
    setMenuAnchor(null);
    setMenuOpen(false);

    if (isSender) {
      try {
        await deleteDoc(doc(db, "chats", data.chatId, "messages", message.id));
        console.log(message.id);
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  return (
    <div ref={ref} className={`message ${isSender ? "owner" : ""}`}>
      <div className="messageInfo">
        <img
          src={isSender ? currentUser.photoURL : data.user.photoURL}
          alt=""
        />
        <span>just now</span>
      </div>
      <div className="messageContent">
        {isSender && (
          <>
            <IconButton
              aria-label="More actions"
              size="small"
              onClick={handleMenuOpen}
              className="inline-block"
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={menuAnchor}
              open={menuOpen}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
              <MenuItem onClick={handleEditClick}>Edit</MenuItem>
            </Menu>
          </>
        )}
        <p>{message.text}</p>

        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
