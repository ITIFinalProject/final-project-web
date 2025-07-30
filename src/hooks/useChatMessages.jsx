import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config";

export function useChatMessages(eventId) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!eventId) return;

    const messagesRef = collection(db, "events", eventId, "chats");
    const q = query(messagesRef, orderBy("createdAt"));

    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsub();
  }, [eventId]);

  return messages;
}
