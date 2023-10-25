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
import { TextField, Tooltip } from "@mui/material";
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

  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [video, setVideo] = useState(null);
  const [document, setDocument] = useState(null);

  const [menuAnchor, setMenuAnchor] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
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
          }),
        });
        uploadingAlert.close();
      } catch (error) {
        console.error("Error uploading image:", error);
        uploadingAlert.close();
      }
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          img: "",
        }),
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
    setDocument(e.target.files[0]);
  };

  const handleUploadDocument = () => {
    setMenuAnchor(null);
    documentInputRef.current.click();
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
          style={{ display: "none" }}
          id="file"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <input
          type="file"
          style={{ display: "none" }}
          id="video-file"
          ref={videoInputRef}
          onChange={handleVideoChange}
        />

        <input
          type="file"
          style={{ display: "none" }}
          id="document-file"
          ref={documentInputRef}
          onChange={handleDocumentChange}
        />

        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
