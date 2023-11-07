import React, { useContext, useRef, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { TextField, alpha, styled, useTheme } from "@mui/material";
import Swal from "sweetalert2";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import ImageIcon from "@mui/icons-material/Image";
import FeaturedVideoIcon from "@mui/icons-material/FeaturedVideo";
import ArticleIcon from "@mui/icons-material/Article";
import { useSelectedMessage } from "../hooks/useSelectedMessage";

import MuiBox from "@mui/material/Box";
import MuiGrid from "@mui/material/Grid";
import MuiButton from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import AttachmentIcon from "@mui/icons-material/Attachment";
import CancelIcon from "@mui/icons-material/Cancel";

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    position: "relative",
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    fieldset: { borderWidth: "0px" },
    "&.Mui-focused": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-error": {
      boxShadow: `${alpha(theme.palette.error.main, 0.25)} 0 0 0 0.2rem`,
    },
  },
  ".MuiFormHelperText-root": {
    fontSize: theme.typography.body1,
    marginLeft: 0,
  },
}));

const Input = () => {
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const { selectedMessage, setSelectedMessage } = useSelectedMessage();

  const [fileName, setFileName] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [video, setVideo] = useState(null);
  const [document, setDocument] = useState(null);

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
      reply: selectedMessage?.id ? selectedMessage : null, // Initialize reply array
    };

    if (document) {
      const storageRef = ref(storage, `${fileName}#${uuid()}`);

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
            document: { fileName, downloadURL },
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
    setSelectedMessage(null);
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

  return (
    <MuiBox sx={{ backgroundColor: "white", padding: theme.spacing(0.5) }}>
      <MuiGrid container>
        {selectedMessage?.id && (
          <MuiGrid
            item
            xs={12}
            sx={{
              backgroundColor: theme.palette.grey[300],
              borderRadius: theme.spacing(1),
              px: theme.spacing(1),
            }}
          >
            <MuiGrid container>
              <MuiGrid item flexGrow={1}>
                {selectedMessage.text}
              </MuiGrid>
              {selectedMessage.img && (
                <MuiGrid item flexGrow={1}>
                  <ImageIcon />
                </MuiGrid>
              )}
              <MuiGrid item>
                <MuiButton onClick={() => setSelectedMessage(null)}>
                  <CancelIcon />
                </MuiButton>
              </MuiGrid>
            </MuiGrid>
          </MuiGrid>
        )}
        <MuiGrid item xs={12}>
          <MuiGrid container sx={{ alignItems: "center" }}>
            <MuiGrid item>
              <IconButton
                onClick={handleAddIconClick}
                sx={{
                  borderRadius: theme.spacing(1),
                  ":hover": { backgroundColor: theme.palette.action.hover },
                }}
              >
                <AttachmentIcon />
              </IconButton>
            </MuiGrid>
            <MuiGrid item sx={{ flexGrow: 1 }}>
              <StyledTextField
                id="filled-basic"
                variant="outlined"
                placeholder="Type Something..."
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                value={text}
                fullWidth
              />
            </MuiGrid>

            <MuiGrid item>
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
                {/* Send */}
                <MuiButton onClick={handleSend}>
                  <SendIcon />
                </MuiButton>
              </div>
            </MuiGrid>
          </MuiGrid>
        </MuiGrid>
      </MuiGrid>
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
    </MuiBox>
  );
};

export default Input;
