import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { updateDoc, getDoc, doc, Timestamp } from "firebase/firestore";
import { getBlob, ref } from "firebase/storage";
import { storage } from "../firebase";
import { db } from "../firebase";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import MuiTypography from "@mui/material/Typography";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ReplyIcon from "@mui/icons-material/Reply";
import MuiGrid from "@mui/material/Grid";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import {
  ImageList,
  ImageListItem,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import Link from "@mui/material/Link";
import { deleteObject } from "firebase/storage";
import { v4 as uuid } from "uuid";

dayjs.extend(relativeTime);

const Message = ({ message }) => {
  const theme = useTheme();
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const refs = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  // open full screen image
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSeletedImage] = useState("");

  const [isReplyingTo, setIsReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    refs.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const isSender = message.senderId === currentUser.uid;
  const isVideoMessage = message.video;
  const isImageMessage = message.img;
  const isDocumentMessage = message.document;

  const downloadDocument = (documentPath, fileName) => {
    const fileRef = ref(storage, documentPath); // Create a reference to the document
    getBlob(fileRef)
      .then((blob) => {
        const url = window.URL || window.webkitURL;
        const link = url.createObjectURL(blob);

        const a = document.createElement("a");
        a.setAttribute("download", fileName);
        a.setAttribute("href", link);
        console.log(link);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch((error) => {
        console.error("Error downloading document:", error);
      });
  };
  const handleEditClick = async (id, senderId) => {
    const newText = prompt("Edit the message:", message.text);

    if (newText !== null && newText !== message.text) {
      // console.log("Editing message with id:", id, "and senderId:", senderId);
      try {
        // Create a Firestore document reference for the message
        const docRef = doc(db, "chats", data.chatId);
        const document = await getDoc(docRef);

        if (document.exists()) {
          const chat = document.data();
          const message = chat.messages.find((message) => message.id === id);

          // update the message
          message.text = newText;
          message.date = Timestamp.now();

          await updateDoc(document.ref, chat);
          console.log("Message Updated Successfully");
        } else {
          console.error("The document does not exist.");
        }
      } catch (error) {
        console.error("Error Updating message:", error);
      }
    }
  };
  const handleDeleteClick = async (id, senderId) => {
    try {
      const docRef = doc(db, "chats", data.chatId);
      const document = await getDoc(docRef);

      if (document.exists()) {
        const chat = document.data();

        const messageIndex = chat.messages.findIndex(
          (message) => message.id === id
        );
        if (messageIndex !== -1) {
          chat.messages[messageIndex].text = "Message Deleted";
          chat.messages[messageIndex].isDeleted = true;

          // Clear the video URL to signify that the video is deleted
          chat.messages[messageIndex].video = null;
          chat.messages[messageIndex].document = null;

          await updateDoc(document.ref, chat);

          if (message.document) {
            const documentRef = ref(storage, message.document);
            await deleteObject(documentRef);
          }

          if (chat.messages[messageIndex].video) {
            const videoRef = ref(storage, chat.messages[messageIndex].video);
            await deleteObject(videoRef);
          }

          chat.messages[messageIndex].video = null;

          await updateDoc(document.ref, chat);

          setIsDeleted(true);
        }
      }
    } catch (error) {
      console.log("Deleted message error", error);
    }
    setMenuAnchor(null);
    setMenuOpen(false);
  };
  // full screen image
  const handleImageClick = (imageURL) => {
    setSeletedImage(imageURL);
    setOpenDialog(true);
  };
  const handleVideoClick = (videoURL) => {
    window.open(videoURL, "_blank");
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
    setMenuOpen(true);
  };
  // const handleReplyClick = () => {
  //   setIsReplying(true);
  //   setRepliedMessage(message);
  // };

  const handleCancelReply = () => {
    setIsReplying(false);
    setRepliedMessage(null);
    setReplyText("");
  };

  // const handleReplyChange = (event) => {
  //   setReplyText(event.target.value);
  // };

  const handleReplyClick = () => {
    setIsReplyingTo(message);
    setReplyText(`Replying to: ${message.text}\n`);
  };

  const handleReplyChange = (event) => {
    setReplyText(event.target.value);
  };

  const handleReplySubmit = async () => {
    const messageObject = {
      id: uuid(),
      text: replyText,
      senderId: currentUser.uid,
      date: Timestamp.now(),
      img: "",
    };

    if (isReplyingTo) {
      // If it's a reply, create a reply object
      const replyObject = {
        replyId: uuid(),
        senderId: currentUser.uid,
        date: Timestamp.now(),
        text: replyText,
      };
      if (!messageObject.replyMessages) {
        messageObject.replyMessages = [];
      }

      messageObject.replyMessages.push(replyObject);
    }
    // Your existing code for handling text messages, images, videos, documents, etc.

    // Now you can update the Firestore document with the messageObject
    try {
      const docRef = doc(db, "chats", data.chatId);
      const document = await getDoc(docRef);

      if (document.exists()) {
        const chat = document.data();

        // Add the new message to the messages array
        chat.messages.push(messageObject);

        // Update the chat document with the modified messages array
        await updateDoc(docRef, chat);
        console.log("Message Sent Successfully");
      } else {
        console.error("The document does not exist.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }

    // Clear the reply state
    setIsReplyingTo(null);
    setReplyText("");
  };

  const content = message.text ? (
    <>
      <MuiGrid
        container
        sx={{
          padding: theme.spacing(0.5),
          borderRadius: theme.spacing(0.5),
          backgroundColor: isSender ? "#005C4B" : "#202C33",
        }}
      >
        <MuiGrid item xs={12}>
          <MuiGrid container>
            <MuiGrid item flexGrow={1}>
              {isDeleted ? (
                <MuiTypography variant="body2">Message Deleted</MuiTypography>
              ) : (
                <MuiTypography
                  variant="body2"
                  sx={{ color: isSender ? "#E9EDD5" : "white" }}
                >
                  {message.text}
                </MuiTypography>
              )}
            </MuiGrid>
          </MuiGrid>
        </MuiGrid>
        <MuiGrid item xs={12} textAlign={isSender ? "end" : "start"}>
          <MuiTypography
            sx={{
              fontSize: theme.spacing(1.2),
              flexGrow: 1,
              lineHeight: theme.spacing(4.5),
              textAlign: isSender ? "end" : "start",
              color: "#8FB89B",
            }}
          >
            {dayjs(new Date(message.date.seconds * 1000)).format(
              "MMM D, h:mm A"
            )}
            {isSender && (
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
            )}
          </MuiTypography>
        </MuiGrid>
      </MuiGrid>
    </>
  ) : isImageMessage ? (
    <div className={` ${isSender ? "w-60 right-0 top-0" : "w-60"}`}>
      <ImageList variant="quilted" cols={1} rowHeight={164}>
        <ImageListItem>
          <img
            src={message.img}
            alt=""
            onClick={() => handleImageClick(message.img)}
            style={{ cursor: "pointer" }}
          />
        </ImageListItem>
      </ImageList>
      {isSender && !isDeleted && (
        <>
          <MuiGrid
            container
            sx={{
              backgroundColor: "#005C4B",
            }}
          >
            <MuiTypography
              variant="body2"
              sx={{
                fontSize: theme.spacing(1.2),
                flexGrow: 1,
                lineHeight: theme.spacing(4.5),
                textAlign: "end",
                color: "#8FB89B",
              }}
            >
              {dayjs(new Date(message.date.seconds * 1000)).format(
                "MMM D, h:mm A"
              )}
            </MuiTypography>
            <IconButton
              aria-label="More actions"
              size="small"
              onClick={handleMenuOpen}
            >
              <MoreVertIcon />
            </IconButton>
          </MuiGrid>
        </>
      )}
      {!isSender && !isDeleted && (
        <MuiGrid container sx={{ backgroundColor: "#202C33" }}>
          <MuiTypography
            variant="body2"
            sx={{
              fontSize: theme.spacing(1.2),
              flexGrow: 1,
              lineHeight: theme.spacing(4.5),
              textAlign: "start",
              color: "#8FB89B",
            }}
          >
            {dayjs(new Date(message.date.seconds * 1000)).format(
              "MMM D, h:mm A"
            )}
          </MuiTypography>
        </MuiGrid>
      )}
    </div>
  ) : isVideoMessage ? (
    <div className={` ${isSender ? "w-60 right-0 top-0" : "w-60"}`}>
      <video
        src={message.video}
        controls
        onClick={() => handleVideoClick(message.video)}
        style={{ cursor: "pointer", width: "100%" }}
      ></video>
      {isSender && !isDeleted && (
        <>
          <MuiGrid
            container
            sx={{
              backgroundColor: "#005C4B",
            }}
          >
            <MuiTypography
              variant="body2"
              sx={{
                fontSize: theme.spacing(1.2),
                flexGrow: 1,
                lineHeight: theme.spacing(4.5),
                textAlign: "end",
                color: "#8FB89B",
              }}
            >
              {dayjs(new Date(message.date.seconds * 1000)).format(
                "MMM D, h:mm A"
              )}
            </MuiTypography>
            <IconButton
              aria-label="More actions"
              size="small"
              onClick={handleMenuOpen}
            >
              <MoreVertIcon />
            </IconButton>
          </MuiGrid>
        </>
      )}
      {!isSender && !isDeleted && (
        <MuiGrid container sx={{ backgroundColor: "#202C33" }}>
          <MuiTypography
            variant="body2"
            sx={{
              fontSize: theme.spacing(1.2),
              flexGrow: 1,
              lineHeight: theme.spacing(4.5),
              textAlign: "start",
              color: "#8FB89B",
            }}
          >
            {dayjs(new Date(message.date.seconds * 1000)).format(
              "MMM D, h:mm A"
            )}
          </MuiTypography>
        </MuiGrid>
      )}
    </div>
  ) : isDocumentMessage ? (
    <div className={` ${isSender ? "w-60 right-0 top-0" : "w-60"}`}>
      <Paper elevation={3} style={{ padding: 16, backgroundColor: "#025144" }}>
        <Link
          href={message.document}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            backgroundColor: isSender ? "#005C4B" : "#005C4B",
            padding: "10px",
            borderRadius: "4px",
          }}
          onClick={(e) => {
            e.preventDefault();
            downloadDocument(message.document, message.fileName);
          }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              backgroundColor: "#90C4F9",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: "10px",
            }}
          >
            <InsertDriveFileIcon fontSize="large" />
          </div>
          <Typography
            sx={{
              color: isSender ? "#E9EDD5" : "white",
              fontSize: "14px",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                color: isSender ? "#E9EDD5" : "white",
                fontSize: "13px",
                textTransform: "uppercase",
              }}
            >
              {message.fileName}
            </span>
          </Typography>
        </Link>
      </Paper>

      {isSender && !isDeleted && (
        <MuiGrid container sx={{ backgroundColor: "#005C4B" }}>
          <MuiTypography
            variant="body2"
            sx={{
              fontSize: theme.spacing(1.2),
              flexGrow: 1,
              lineHeight: theme.spacing(4.5),
              textAlign: "end",
              color: "#8FB89B",
            }}
          >
            {dayjs(new Date(message.date.seconds * 1000)).format(
              "MMM D, h:mm A"
            )}
          </MuiTypography>
          <IconButton
            aria-label="More actions"
            size="small"
            onClick={handleMenuOpen}
          >
            <MoreVertIcon />
          </IconButton>
        </MuiGrid>
      )}
      {!isSender && !isDeleted && (
        <MuiGrid container sx={{ backgroundColor: "#202C33" }}>
          <MuiTypography
            variant="body2"
            sx={{
              fontSize: theme.spacing(1.2),
              flexGrow: 1,
              lineHeight: theme.spacing(4.5),
              textAlign: "start",
              color: "#8FB89B",
              marginLeft: "10px",
            }}
          >
            {dayjs(new Date(message.date.seconds * 1000)).format(
              "MMM D, h:mm A"
            )}
          </MuiTypography>
        </MuiGrid>
      )}
    </div>
  ) : null;

  return (
    <div
      ref={ref}
      className={`message  ${isSender ? "owner" : ""} ${
        isDeleted ? "deleted" : ""
      }`}
    >
      <div className="messageInfo">
        <IconButton aria-label="Reply" size="small" onClick={handleReplyClick}>
          <ReplyIcon />
        </IconButton>
        {isSender && (
          <div className="messageActions">
            <IconButton
              aria-label="More actions"
              size="small"
              onClick={handleMenuOpen}
              className="inline-block"
            >
              {/* <MoreVertIcon /> */}
            </IconButton>
            <Menu
              anchorEl={menuAnchor}
              open={menuOpen}
              onClose={handleDeleteClick}
            >
              {message.text && (
                <MenuItem
                  onClick={() => handleEditClick(message.id, message.senderId)}
                >
                  <MuiTypography variant="body2">Edit</MuiTypography>
                </MenuItem>
              )}
              <MenuItem
                onClick={() => handleDeleteClick(message.id, message.senderId)}
              >
                <MuiTypography variant="body2">Delete</MuiTypography>
              </MenuItem>
            </Menu>
          </div>
        )}
      </div>

      <img
        className="messageInfo"
        src={isSender ? currentUser.photoURL : data.user.photoURL}
        alt=""
        style={{ width: "25px", height: "25px", borderRadius: "50%" }}
      />

      <div className="messageContent">
        {content}
        {isReplyingTo && (
          <div className="replyInput">
            <textarea
              row="3"
              placeholder="Reply to this message..."
              value={replyText}
              onChange={handleReplyChange}
            ></textarea>
            <button onClick={handleReplySubmit}>Send Reply</button>
            <button onClick={handleCancelReply}>Cancel</button>
          </div>
        )}

        <Dialog
          open={openDialog}
          onClose={handleDialogClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Fullscreen Image
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleDialogClose}
              aria-label="close"
              style={{
                position: "absolute",
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <img
              src={selectedImage}
              alt="Fullscreen"
              style={{ width: "100%" }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Message;
