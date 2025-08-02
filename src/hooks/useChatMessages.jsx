// import { useEffect, useState } from "react";
// import {
//   collection,
//   query,
//   orderBy,
//   onSnapshot,
// } from "firebase/firestore";
// import { db } from "../firebase/config";

// export function useChatMessages(eventId) {
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     if (!eventId) return;

//     const messagesRef = collection(db, "events", eventId, "chats");
//     const q = query(messagesRef, orderBy("createdAt"));

//     const unsub = onSnapshot(q, (snapshot) => {
//       const msgs = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setMessages(msgs);
//     });

//     return () => unsub();
//   }, [eventId]);

//   return messages;
// }








// 4. Enhanced useChatMessages hook with unread count
import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config";

export function useChatMessages(eventId, currentUserId) {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

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

      // Calculate unread count
      if (currentUserId) {
        const unread = msgs.filter(msg => 
          !msg.readBy?.includes(currentUserId) && 
          msg.senderId !== currentUserId
        ).length;
        setUnreadCount(unread);
      }
    });

    return () => unsub();
  }, [eventId, currentUserId]);

  return { messages, unreadCount };
}

// 5. Hook to get total unread messages across all events
export function useUnreadMessagesCount(userId, userEvents) {
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [unreadByEvent, setUnreadByEvent] = useState({});

  useEffect(() => {
    if (!userId || !userEvents?.length) {
      setTotalUnreadCount(0);
      setUnreadByEvent({});
      return;
    }

    const unsubscribes = [];
    const eventUnreadCounts = {};

    userEvents.forEach(event => {
      const messagesRef = collection(db, "events", event.id, "chats");
      const q = query(messagesRef, orderBy("createdAt"));

      const unsub = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const unreadCount = msgs.filter(msg => 
          !msg.readBy?.includes(userId) && 
          msg.senderId !== userId
        ).length;

        eventUnreadCounts[event.id] = unreadCount;
        
        setUnreadByEvent({...eventUnreadCounts});
        
        const total = Object.values(eventUnreadCounts).reduce((sum, count) => sum + count, 0);
        setTotalUnreadCount(total);
      });

      unsubscribes.push(unsub);
    });

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [userId, userEvents]);

  return { totalUnreadCount, unreadByEvent };
}

