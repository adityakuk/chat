import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useCurrentUser = () => {
  const { currentUser } = useContext(AuthContext);
  const { displayName, uid } = currentUser;

  return { displayName, uid };
};
