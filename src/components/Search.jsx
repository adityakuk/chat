import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { TextField, Typography } from "@mui/material";
const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    setErr(false); // Reset error state

    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      console.log("Calling handleSelect with combinedId:", combinedId);

      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        console.log("Chat does not exist, creating it...");

        // Create a chat in the "chats" collection
        await setDoc(doc(db, "chats", combinedId), {});

        // Create/update user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId]: {
            userInfo: {
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL,
            },
            date: serverTimestamp(),
          },
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId]: {
            userInfo: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            },
            date: serverTimestamp(),
          },
        });
      }
    } catch (err) {
      console.error("Error in handleSelect:", err);
    }
    setUser(null);
    setUsername("");
  };
  return (
    <div className="search" style={{ color: "#111B21" }}>
      <div className="searchForm" style={{ backgroundColor: "#111B21" }}>
        <Typography>
          <TextField
            label="Search User"
            variant="outlined"
            InputLabelProps={{
              style: { color: "white" },
            }}
            InputProps={{
              sx: {
                border: "1px solid blue",
                width: "400px",
              },
            }}
            onKeyDown={handleKey}
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            sx={{
              backgroundColor: "#202C33",
            }}
          />
        </Typography>
      </div>
      {err && <span>User not found!</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
