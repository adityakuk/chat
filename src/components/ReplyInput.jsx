// import { useContext, useState } from "react";
// import { Timestamp, arrayUnion, doc, updateDoc } from "firebase/firestore";
// import { db } from "../firebase";
// import { v4 as uuid } from "uuid";
// import { AuthContext } from "../context/AuthContext";

// const ReplyInput = ({ onReply, onClose, chatId }) => {
//   const [replyText, setReplyText] = useState(""); // Change replyContent to replyText
//   const { currentUser } = useContext(AuthContext);

//   const handleSendReply = async () => {
//     if (replyText.trim() !== "") {
//       try {
//         // Update the chat in Firebase with the reply message
//         const chatDocRef = doc(db, "chats", chatId);
//         await updateDoc(chatDocRef, {
//           messages: arrayUnion({
//             id: uuid(),
//             text: replyText,
//             senderId: currentUser.uid,
//             date: Timestamp.now(),
//           }),
//         });

//         // Send the reply text to the parent component
//         onReply(replyText);

//         // Clear the reply input field
//         setReplyText("");

//         // Close the reply input field
//         onClose();
//       } catch (error) {
//         console.error("Error updating chat with reply:", error);
//         // Handle the error as needed
//       }
//     }
//   };

//   const cancelReply = () => {
//     // Clear the reply input field
//     setReplyText("");

//     // Close the reply input field
//     onClose();
//   };

//   return (
//     <div>
//       <textarea
//         rows="3"
//         placeholder="Write your reply..."
//         value={replyText}
//         onChange={(e) => setReplyText(e.target.value)}
//       />
//       <button onClick={handleSendReply}>Send Reply</button>
//       <button onClick={cancelReply}>Cancel</button>
//     </div>
//   );
// };

// export default ReplyInput;
