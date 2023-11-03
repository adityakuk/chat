import React, { useContext, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { TextField } from "@mui/material";
import Swal from "sweetalert2";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import ImageIcon from "@mui/icons-material/Image";
import FeaturedVideoIcon from "@mui/icons-material/FeaturedVideo";
import ArticleIcon from "@mui/icons-material/Article";

const Input = () => {
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const documentInputRef = useRef(null);

  const [fileName, setFileName] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [video, setVideo] = useState(null);
  const [document, setDocument] = useState(null);

  const [replyText, setReplyText] = useState(""); // State for reply text
  const [isReplyingTo, setIsReplyingTo] = useState(null); // State for the message being replied to

  const [menuAnchor, setMenuAnchor] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    const messageObject = {
      id: uuid(),
      text,
      senderId: currentUser.uid,
      date: Timestamp.now(),
      img: "",
      replyMessages: [], // Initialize replyMessages array
    };

    if (isReplyingTo) {
      // If it's a reply, create a reply object
      const replyObject = {
        replyId: uuid(),
        senderId: currentUser.uid,
        date: Timestamp.now(),
        text: replyText,
      };

      messageObject.replyMessages.push(replyObject);
    }

    if (document) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, document);

      const uploadingAlert = Swal.fire({
        title: "Document Uploading...",
        html: "Please wait while the document is being uploaded",
        onBeforeOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
      });

      try {
        await uploadTask;
        const downloadURL = await getDownloadURL(storageRef);

        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,

            senderId: currentUser.uid,
            date: Timestamp.now(),
            document: downloadURL,
            replyMessages: messageObject.replyMessages,
          }),
        });
        uploadingAlert.close();
      } catch (error) {
        console.error("Error uploading document", error);
        uploadingAlert.close();
      }
    } else if (video) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, video);

      const uploadingAlert = Swal.fire({
        title: "Video Uploading...",
        html: "Please wait while the video is being uploaded",
        onBeforeOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: false,
      });

      try {
        await uploadTask;
        const downloadURL = await getDownloadURL(storageRef);

        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
            video: downloadURL,
            replyMessages: messageObject.replyMessages,
          }),
        });
        uploadingAlert.close();
      } catch (error) {
        console.log("Error uploading video:", error);
        uploadingAlert.close();
      }
    } else if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      const uploadingAlert = Swal.fire({
        title: "Image Uploading...",
        html: "Please wait while the image is being uploaded",
        onBeforeOpen: () => {
          Swal.showLoading();
        },
        allowOutsideClick: "false",
      });

      try {
        await uploadTask;
        const downloadURL = await getDownloadURL(storageRef);

        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
            img: downloadURL,
            replyMessages: messageObject.replyMessages,
          }),
        });
        uploadingAlert.close();
      } catch (error) {
        console.error("Error uploading image:", error);
        uploadingAlert.close();
      }
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion(messageObject),
      });
    }
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
    setVideo(null);
    setDocument(null);
    setIsReplyingTo(null);
    setReplyText("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };

  const handleAddIconClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleUploadImage = (e) => {
    setMenuAnchor(null);
    fileInputRef.current.click();
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleFileChange = (e) => {
    setImg(e.target.files[0]);
  };

  const handleUploadVideo = () => {
    setMenuAnchor(null);
    videoInputRef.current.click();
  };

  const handleDocumentChange = (e) => {
    const doc = e.target.files[0];
    setDocument(doc);
    setFileName(doc?.name);
  };

  const handleUploadDocument = () => {
    setMenuAnchor(null);
    documentInputRef.current.click();
  };

  const handleReplyChange = (e) => {
    setReplyText(e.target.value);
  };

  const handleReplySubmit = async () => {
    if (replyText.trim() !== "") {
      // Create the reply message object
      const replyMessage = {
        id: uuid(), // Generate a unique ID for the reply message
        text: replyText,
        senderId: currentUser.uid,
        date: Timestamp.now(),
        isReply: true, // Add a property to identify this as a reply
        replyToMessageId: isReplyingTo.id, // Include the ID of the message being replied to
      };

      try {
        const docRef = doc(db, "chats", data.chatId);
        const document = await getDoc(docRef);

        if (document.exists()) {
          const chat = document.data();

          // Add the reply message to the replyMessages array
          chat.messages.push(replyMessage);

          // Update the chat document with the modified messages array
          await updateDoc(docRef, chat);
          console.log("Reply Sent Successfully");
        } else {
          console.error("The document does not exist.");
        }
      } catch (error) {
        console.error("Error sending reply:", error);
      }

      // Reset the reply text and clear the reply state
      setIsReplyingTo(null);
      setReplyText("");
    }
  };

  return (
    <div className="input">
      <TextField
        id="filled-basic"
        label="Type Something..."
        variant="filled"
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        value={text}
        sx={{ width: "100%" }}
      />
      <IconButton
        onClick={handleAddIconClick}
        sx={{
          backgroundColor: "#202C33",
          marginLeft: "10px",
          "&:hover": {
            backgroundColor: "#374248",
          },
        }}
      >
        <AddIcon
          sx={{
            color: "white",
          }}
        />
      </IconButton>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleUploadImage}>
          <ImageIcon sx={{ marginRight: "10px" }} /> Image
        </MenuItem>
        <MenuItem onClick={handleUploadVideo}>
          <FeaturedVideoIcon sx={{ marginRight: "10px" }} />
          Video
        </MenuItem>
        <MenuItem onClick={handleUploadDocument}>
          <ArticleIcon sx={{ marginRight: "10px" }} />
          Doc
        </MenuItem>
      </Menu>

      <div className="send ml-2">
        <input
          type="file"
          id="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          hidden
        />
        <input
          type="file"
          id="video-file"
          ref={videoInputRef}
          onChange={handleVideoChange}
          hidden
        />

        <input
          type="file"
          id="document-file"
          ref={documentInputRef}
          onChange={handleDocumentChange}
          hidden
        />

        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
