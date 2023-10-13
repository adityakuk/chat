import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { updateDoc, getDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { format, formatDistance } from "date-fns";
import { enIN } from "date-fns/locale";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  // open full screen image
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSeletedImage] = useState("");

  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const isSender = message.senderId === currentUser.uid;

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
    setMenuOpen(true);
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuOpen(false);
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

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const content = message.text ? (
    <p className={`message-text ${isDeleted ? "deleted-text" : ""}`}>
      {isDeleted ? "Message Deleted" : message.text}
      <div className="message-timestamp">
        {message.date?.seconds && (
          <Typography
            variant="body2"
            color="textSecondary"
            className="text-gray-300 text-sm"
            sx={{ fontSize: "0.75rem" }}
          >
            {dayjs(new Date(message.date.seconds * 1000)).fromNow()}
            {isSender && (
              <span className="more-icon">
                <IconButton
                  aria-label="More actions"
                  size="small"
                  onClick={handleMenuOpen}
                  sx={{ float: "right" }}
                >
                  <MoreVertIcon />
                </IconButton>
              </span>
            )}
          </Typography>
        )}
      </div>
    </p>
  ) : (
    <div className="flex justify-end items-end">
      <div
        className={` ${
          isSender
            ? " w-60 right-0 top-0 text-right bg-slate-500"
            : "bg-red-600"
        }`}
      >
        <div className="">
          <img
            src={message.img}
            alt=""
            onClick={() => handleImageClick(message.img)}
            className="clickable-image "
          />
          {isSender &&
            !isDeleted && ( // Only show MoreVertIcon for undeleted images
              <span className="more-icon">
                {formatDistance(
                  new Date(),
                  new Date(message.date.seconds * 1000),
                  "hh:mm a",
                  {
                    locale: enIN,
                    addSuffix: true,
                    includeSeconds: true,
                  }
                )}
                <IconButton
                  aria-label="More actions"
                  size="small"
                  onClick={handleMenuOpen}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={menuAnchor}
                  open={menuOpen}
                  onClose={handleDeleteClick}
                >
                  <MenuItem
                    onClick={() =>
                      handleDeleteClick(message.id, message.senderId)
                    }
                  >
                    Delete
                  </MenuItem>
                </Menu>
              </span>
            )}
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={ref}
      className={`message ${isSender ? "owner" : ""} ${
        isDeleted ? "deleted" : ""
      }`}
    >
      <div className="messageInfo">
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
              <MenuItem
                onClick={() => handleEditClick(message.id, message.senderId)}
              >
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => handleDeleteClick(message.id, message.senderId)}
              >
                Delete
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

// import React, { useContext, useEffect, useRef, useState } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { ChatContext } from "../context/ChatContext";
// import IconButton from "@mui/material/IconButton";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import {
//   updateDoc,
//   collection,
//   query,
//   where,
//   getDoc,
//   doc,
//   Timestamp,
// } from "firebase/firestore";
// import { db } from "../firebase";
// import {
//   format,
//   formatDistance,
//   formatRelative,
//   parseISO,
//   subDays,
// } from "date-fns";
// import { enIN } from "date-fns/locale";

// const Message = ({ message }) => {
//   const { currentUser } = useContext(AuthContext);
//   const { data } = useContext(ChatContext);

//   const ref = useRef();
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [menuAnchor, setMenuAnchor] = useState(null);

//   useEffect(() => {
//     ref.current?.scrollIntoView({ behavior: "smooth" });
//   }, [message]);

//   const isSender = message.senderId === currentUser.uid;

//   const handleMenuOpen = (event) => {
//     setMenuAnchor(event.currentTarget);
//     setMenuOpen(true);
//   };

//   const handleEditClick = async (id, senderId) => {
//     const newText = prompt("Edit the message:", message.text);

//     if (newText !== null && newText !== message.text) {
//       // console.log("Editing message with id:", id, "and senderId:", senderId);
//       try {
//         // Create a Firestore document reference for the message
//         const docRef = doc(db, "chats", data.chatId);
//         const document = await getDoc(docRef);

//         if (document.exists()) {
//           const chat = document.data();
//           const message = chat.messages.find((message) => message.id === id);

//           // update the message
//           message.text = newText;
//           message.date = Timestamp.now();

//           await updateDoc(document.ref, chat);
//           console.log("Message Updated Successfully");
//         } else {
//           console.error("The document does not exist.");
//         }
//         // Check if the document exists
//         // const docSnapshot = await getDoc(messageDocRef);
//         // console.log(docSnapshot);

//         // if (docSnapshot.exists()) {
//         //   // Document exists, proceed with the update
//         //   await updateDoc(messageDocRef, {
//         //     text: newText,
//         //   });

//         // } else {
//         //   // Document doesn't exist, handle the error
//         //   console.error("The document does not exist.");
//         // }
//       } catch (error) {
//         console.error("Error Updating message:", error);
//       }
//     }
//   };

//   const handleMenuClose = () => {
//     setMenuAnchor(null);
//     setMenuOpen(false);
//   };

//   return (
//     <div ref={ref} className={`message ${isSender ? "owner" : ""}`}>
//       <div className="messageInfo flex justify-between">
//         <img
//           src={isSender ? currentUser.photoURL : data.user.photoURL}
//           alt=""
//         />
//         {/* <span>{format(parseISO(message.date), )}</span> */}
//         <div>
//           {/* Move MoreVertIcon here */}
//           {isSender && (
//             <>
//               <IconButton
//                 aria-label="More actions"
//                 size="small"
//                 onClick={handleMenuOpen}
//                 className="inline-block"
//               >
//                 <MoreVertIcon />
//               </IconButton>
//               <Menu
//                 anchorEl={menuAnchor}
//                 open={menuOpen}
//                 onClose={handleMenuClose}
//               >
//                 <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
//                 <MenuItem
//                   onClick={() => handleEditClick(message.id, message.senderId)}
//                 >
//                   Edit
//                 </MenuItem>
//               </Menu>
//             </>
//           )}
//         </div>
//       </div>
//       <div className="messageContent">
//         {isSender && (
//           <>
//             <IconButton
//               aria-label="More actions"
//               size="small"
//               onClick={handleMenuOpen}
//               className="inline-block"
//             >
//               <MoreVertIcon />
//             </IconButton>
//             <Menu
//               anchorEl={menuAnchor}
//               open={menuOpen}
//               onClose={handleMenuClose}
//             >
//               <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
//               <MenuItem
//                 onClick={() => handleEditClick(message.id, message.senderId)}
//               >
//                 Edit
//               </MenuItem>
//             </Menu>
//           </>
//         )}
//         <p>{message.text}</p>
//         {message.img && <img src={message.img} alt="" />}
//         <span className="bg-black">
//           {formatDistance(
//             new Date(),
//             new Date(message.date.seconds * 1000),
//             "hh:mm a",
//             {
//               locale: enIN,
//               addSuffix: true,
//               includeSeconds: true,
//             }
//           )}
//           {/*
//           {format(new Date(message.date.seconds * 1000), "hh:mm a", {
//             locale: enIN,
//           })} */}
//         </span>
//       </div>
//     </div>
//   );
// };

// export default Message;

// const handleEditClick = async () => {
//   const newText = prompt("Edit the message:", message.text);

//   if (newText !== null && newText !== message.text) {
//     try {
//       // Create a Firestore document reference for the message
//       const messagesRef = collection(db, "chats", data.chatId, "messages");

//       const q = query(messagesRef, where("senderId", "==", message.senderId));

//       const querySnapshot = await getDocs(q);

//       querySnapshot.forEach(async (doc) => {
//         const messageDocRef = doc(
//           db,
//           "chats",
//           data.chatId,
//           "messages",
//           doc.id
//         );

//         await updateDoc(messageDocRef, {
//           text: newText,
//         });
//         console.log("Message Updated Successfully");
//       });
//     } catch (error) {
//       console.error("Error Updating messages:", error);
//     }
//   }
// };
