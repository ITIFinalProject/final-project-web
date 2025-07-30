import { db } from "../../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const SendMessage = async (eventId, user, message) => {
  if (!message.trim()) return;

  const chatRef = collection(db, "events", eventId, "chats");
  await addDoc(chatRef, {
    senderId: user.uid,
    senderName: user.displayName || "Anonymous",
    message: message.trim(),
    createdAt: serverTimestamp(), // ✅ FIXED KEY NAME
  });
};
