// import { db } from "../../firebase/config";
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// export const SendMessage = async (eventId, user, message) => {
//   if (!message.trim()) return;

//   const chatRef = collection(db, "events", eventId, "chats");
//   await addDoc(chatRef, {
//     senderId: user.uid,
//     senderName: user.displayName || "Anonymous",
//     message: message.trim(),
//     createdAt: serverTimestamp(), // ✅ FIXED KEY NAME
//   });
// };




// 1. Enhanced SendMessage with read status tracking
import { db } from "../../firebase/config";
import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion } from "firebase/firestore";

export const SendMessage = async (eventId, user, message) => {
  if (!message.trim()) return;

  const chatRef = collection(db, "events", eventId, "chats");
  
  // Add message with readBy array
  const messageDoc = await addDoc(chatRef, {
    senderId: user.uid,
    senderName: user.displayName || "Anonymous",
    message: message.trim(),
    createdAt: serverTimestamp(),
    readBy: [user.uid], // Sender automatically reads their own message
  });

  return messageDoc.id;
};

// 2. Mark message as read function
export const markMessageAsRead = async (eventId, messageId, userId) => {
  try {
    const messageRef = doc(db, "events", eventId, "chats", messageId);
    await updateDoc(messageRef, {
      readBy: arrayUnion(userId)
    });
  } catch (error) {
    console.error("Error marking message as read:", error);
  }
};

// 3. Mark all messages in chat as read
export const markAllMessagesAsRead = async (eventId, userId, messages) => {
  const unreadMessages = messages.filter(msg => 
    !msg.readBy?.includes(userId) && msg.senderId !== userId
  );

  const promises = unreadMessages.map(msg => 
    markMessageAsRead(eventId, msg.id, userId)
  );

  try {
    await Promise.all(promises);
  } catch (error) {
    console.error("Error marking all messages as read:", error);
  }
};