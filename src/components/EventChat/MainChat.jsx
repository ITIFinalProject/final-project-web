// import { useEffect, useState, useRef } from "react";
// import { doc, getDoc } from "firebase/firestore";
// import { useChatMessages } from "../../hooks/useChatMessages";
// import { SendMessage } from "./SendMessage";
// import { db } from "../../firebase/config";
// import { FaArrowLeft } from "react-icons/fa";
// import { IoSendSharp } from "react-icons/io5";

// function MainChat({ eventId, user, onBack }) {
//   const [input, setInput] = useState("");
//   const messages = useChatMessages(eventId);
//   const [eventTitle, setEventTitle] = useState("Loading...");
//   const bottomRef = useRef();

//   // Fetch event title from Firestore
//   useEffect(() => {
//     const fetchEvent = async () => {
//       const docRef = doc(db, "events", eventId);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setEventTitle(docSnap.data().title || "Chat");
//       } else {
//         setEventTitle("Chat");
//       }
//     };

//     fetchEvent();
//   }, [eventId]);

//   const handleSend = async () => {
//     if (input.trim()) {
//       await SendMessage(eventId, user, input);
//       setInput("");
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleSend();
//     }
//   };

//   // Auto scroll
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Format timestamp
//   const formatTime = (timestamp) => {
//     if (!timestamp) return "";
//     const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//     return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//   };

//   return (
//     <div className="main-chat">
//       <div className="chat-header">
//         <button onClick={onBack}>
//           <FaArrowLeft />
//         </button>
//         <h5>{eventTitle}</h5>
//         <div className="user-status"></div>
//       </div>

//       <div className="chat-messages">
//         {messages.map((msg) => {
//           const isOwnMessage = user && msg.senderId === user.uid;

//           return (
//             <div
//               key={msg.id}
//               className={`chat-bubble ${
//                 isOwnMessage ? "own-message" : "other-message"
//               }`}
//             >
//               {!isOwnMessage && (
//                 <div className="sender-name">
//                   {msg.senderName || "Anonymous"}
//                 </div>
//               )}
//               <div className="message-text">{msg.message}</div>
//               <div className="message-time">{formatTime(msg.createdAt)}</div>
//             </div>
//           );
//         })}
//         <div ref={bottomRef} />
//       </div>

//       <div className="chat-input">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder="Type your message..."
//         />
//         <button onClick={handleSend} disabled={!input.trim()}>
//           <IoSendSharp />
//         </button>
//       </div>
//     </div>
//   );
// }

// export default MainChat;







// 6. Enhanced MainChat component
import { useEffect, useState, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useChatMessages } from "../../hooks/useChatMessages";
import { SendMessage, markAllMessagesAsRead } from "./SendMessage";
import { db } from "../../firebase/config";
import { FaArrowLeft } from "react-icons/fa";
import { IoSendSharp } from "react-icons/io5";

function MainChat({ eventId, user, onBack }) {
  const [input, setInput] = useState("");
  const { messages, unreadCount } = useChatMessages(eventId, user?.uid);
  const [eventTitle, setEventTitle] = useState("Loading...");
  const bottomRef = useRef();
  const [isVisible, setIsVisible] = useState(true);

  // Fetch event title from Firestore
  useEffect(() => {
    const fetchEvent = async () => {
      const docRef = doc(db, "events", eventId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setEventTitle(docSnap.data().title || "Chat");
      } else {
        setEventTitle("Chat");
      }
    };

    fetchEvent();
  }, [eventId]);

  // Mark messages as read when chat is visible and has unread messages
  useEffect(() => {
    if (isVisible && user?.uid && unreadCount > 0) {
      const timer = setTimeout(() => {
        markAllMessagesAsRead(eventId, user.uid, messages);
      }, 1000); // Mark as read after 1 second of being visible

      return () => clearTimeout(timer);
    }
  }, [isVisible, user?.uid, unreadCount, eventId, messages]);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleSend = async () => {
    if (input.trim()) {
      await SendMessage(eventId, user, input);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="main-chat">
      <div className="chat-header">
        <button onClick={onBack}>
          <FaArrowLeft />
        </button>
        <h5>
          {eventTitle}
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </h5>
        <div className="user-status"></div>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => {
          const isOwnMessage = user && msg.senderId === user.uid;
          const isUnread = !msg.readBy?.includes(user?.uid) && !isOwnMessage;

          return (
            <div
              key={msg.id}
              className={`chat-bubble ${
                isOwnMessage ? "own-message" : "other-message"
              } ${isUnread ? "unread-message" : ""}`}
            >
              {!isOwnMessage && (
                <div className="sender-name">
                  {msg.senderName || "Anonymous"}
                </div>
              )}
              <div className="message-text">{msg.message}</div>
              <div className="message-time">{formatTime(msg.createdAt)}</div>
              {isUnread && <div className="unread-indicator">NEW</div>}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
        />
        <button onClick={handleSend} disabled={!input.trim()}>
          <IoSendSharp />
        </button>
      </div>
    </div>
  );
}
export default MainChat;
