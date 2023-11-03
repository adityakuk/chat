import { useContext } from "react";
import { SelectedMessageContext } from "../context/SelectedMessage";

export const useSelectedMessage = () => {
  const selectedMessage = useContext(SelectedMessageContext);
  return selectedMessage;
};
