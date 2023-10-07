import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  updateDoc,
  collection,
  query,
  where,
  getDoc,
  doc,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  format,
  formatDistance,
  formatRelative,
  parseISO,
  subDays,
} from "date-fns";
import { enIN } from "date-fns/locale";

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

        chat.messages = chat.messages.filter((message) => message.id !== id);

        await updateDoc(document.ref, chat);
      }
    } catch (error) {
      console.log("Deleted message error", error);
    }
    setMenuAnchor(null);
    setMenuOpen(false);
  };

  return (
    <div ref={ref} className={`message ${isSender ? "owner" : ""}`}>
      <div className="messageInfo flex justify-between items-center">
        <img
          src={isSender ? currentUser.photoURL : data.user.photoURL}
          alt=""
        />
        {/* <span>{format(parseISO(message.date), )}</span> */}
        <div>
          {/* Move MoreVertIcon here */}
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
                onClose={handleDeleteClick}
              >
                <MenuItem
                  onClick={() =>
                    handleDeleteClick(message.id, message.senderId)
                  }
                >
                  Delete
                </MenuItem>
                <MenuItem
                  onClick={() => handleEditClick(message.id, message.senderId)}
                >
                  Edit
                </MenuItem>
              </Menu>
            </>
          )}
        </div>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
        <span className="bg-black sm:text-sm text-xs">
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
          {/*           
          {format(new Date(message.date.seconds * 1000), "hh:mm a", {
            locale: enIN,
          })} */}
        </span>
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
