import { createContext, useState } from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";

// 1. Create a context object with default value
const defaultContext = { selectedMessage: null, setSelectedMessage: null };
export const SelectedMessageContext = createContext(defaultContext);

export default function SelectedMessageProvider({ children }) {
  const { displayName } = useCurrentUser();
  const [selectedMessage, setSelectedMessage] = useState({
    id: null,
    text: null,
    displayName,
  });

  return (
    <SelectedMessageContext.Provider
      value={{ selectedMessage, setSelectedMessage }}
    >
      {children}
    </SelectedMessageContext.Provider>
  );
}
