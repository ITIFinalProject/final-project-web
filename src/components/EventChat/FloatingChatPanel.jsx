// import { useState } from "react";
// import ChatList from "./ChatList";
// import MainChat from "./MainChat";
// import { auth } from "../../firebase/config";
// import "../../styles/eventChat.css";
// import { useSelector } from "react-redux";

// function FloatingChatPanel() {
//   const [activeChatId, setActiveChatId] = useState(null); // selected event/chat
//   const [isExpanded, setIsExpanded] = useState(false); // panel expanded state
//   const user = auth.currentUser;
//   const { currentUser } = useSelector((state) => state.auth);

//   const togglePanel = () => {
//     setIsExpanded(!isExpanded);
//     // Reset chat selection when closing
//     if (isExpanded) {
//       setActiveChatId(null);
//     }
//   };

//   const handleChatSelect = (chatId) => {
//     setActiveChatId(chatId);
//   };

//   const handleBackToList = () => {
//     setActiveChatId(null);
//   };

//   return (
//     <>
//       {currentUser ? (
//         <div
//           className={`floating-chat-panel ${
//             isExpanded ? "expanded" : "collapsed"
//           }`}
//         >
//           {!isExpanded ? (
//             // Collapsed state - show chat icon
//             <div onClick={togglePanel} style={{ cursor: "pointer" }}>
//               Chats
//             </div>
//           ) : (
//             // Expanded state - show chat interface
//             <>
//               {!activeChatId ? (
//                 <ChatList onSelect={handleChatSelect} onClose={togglePanel} />
//               ) : (
//                 <MainChat
//                   eventId={activeChatId}
//                   user={user}
//                   onBack={handleBackToList}
//                   onClose={togglePanel}
//                 />
//               )}
//             </>
//           )}
//         </div>
//       ) : null}
//     </>
//   );
// }

// export default FloatingChatPanel;






// 8. Enhanced FloatingChatPanel with notification badge
import { useState } from "react";
import ChatList from "./ChatList";
import MainChat from "./MainChat";
import { auth } from "../../firebase/config";
import "../../styles/eventChat.css";
import { useSelector } from "react-redux";
import { useUnreadMessagesCount } from "../../hooks/useChatMessages";

function FloatingChatPanel() {
  const [activeChatId, setActiveChatId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const user = auth.currentUser;
  const { currentUser } = useSelector((state) => state.auth);
  const { myEvents } = useSelector((state) => state.events);
  
  const { totalUnreadCount } = useUnreadMessagesCount(currentUser?.uid, myEvents);

  const togglePanel = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      setActiveChatId(null);
    }
  };

  const handleChatSelect = (chatId) => {
    setActiveChatId(chatId);
  };

  const handleBackToList = () => {
    setActiveChatId(null);
  };

  return (
    <>
      {currentUser ? (
        <div
          className={`floating-chat-panel ${
            isExpanded ? "expanded" : "collapsed"
          }`}
        >
          {!isExpanded ? (
            <div onClick={togglePanel} style={{ cursor: "pointer" }} className="togglePanel">
              Chats
              {totalUnreadCount > 0 && (
                <span className="total-unread-badge">{totalUnreadCount}</span>
              )}
            </div>
          ) : (
            <>
              {!activeChatId ? (
                <ChatList onSelect={handleChatSelect} onClose={togglePanel} />
              ) : (
                <MainChat
                  eventId={activeChatId}
                  user={user}
                  onBack={handleBackToList}
                  onClose={togglePanel}
                />
              )}
            </>
          )}
        </div>
      ) : null}
    </>
  );
}

export default FloatingChatPanel;