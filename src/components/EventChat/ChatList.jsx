// import { useEffect, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../../firebase/config";
// import { FaTimes } from "react-icons/fa";
// import { IoChatboxSharp } from "react-icons/io5";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchMyEvents } from "../../redux/slices/eventSlice";

// function ChatList({ onSelect, onClose }) {
//     const dispatch = useDispatch();
//     const { currentUser } = useSelector((state) => state.auth);

//     const { myEvents, myEventsLoading, myEventsError } = useSelector((state) => ({
//         myEvents: state.events.myEvents,
//         myEventsLoading: state.events.myEventsLoading,
//         myEventsError: state.events.myEventsError,
//     }));

//     useEffect(() => {
//         if (currentUser?.uid) {
//             dispatch(fetchMyEvents(currentUser?.uid));
//         }
//     }, [dispatch, currentUser?.uid]);

//     return (
//         <>
//             <div className="chat-header">
//                 <h5>Event Chats</h5>
//                 <button onClick={onClose}>
//                     <FaTimes />
//                 </button>
//             </div>

//             <div className="chat-list">
//                 {/* {myEventsLoading && <p>Loading...</p>} */}
//                 {myEventsError && <p className="error">{myEventsError}</p>}

//                 {!myEventsLoading && !myEventsError && myEvents.length === 0 && (
//                     <p>No event chats available.</p>
//                 )}

//                 {
//                     myEventsLoading ? <p>Loading...</p> :
//                         myEvents.map((event) => (
//                             <div
//                                 key={event.id}
//                                 className="chat-item"
//                                 onClick={() => onSelect(event.id)}
//                             >
//                                 <IoChatboxSharp /> &nbsp; {event.title}
//                             </div>
//                         ))}
//             </div>
//         </>
//     );
// }
// export default ChatList;







// 7. Enhanced ChatList component with unread indicators
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { FaTimes } from "react-icons/fa";
import { IoChatboxSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyEvents } from "../../redux/slices/eventSlice";
import { useUnreadMessagesCount } from "../../hooks/useChatMessages";

function ChatList({ onSelect, onClose }) {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);

  const { myEvents, myEventsLoading, myEventsError } = useSelector((state) => ({
    myEvents: state.events.myEvents,
    myEventsLoading: state.events.myEventsLoading,
    myEventsError: state.events.myEventsError,
  }));

  const { unreadByEvent } = useUnreadMessagesCount(currentUser?.uid, myEvents);

  useEffect(() => {
    if (currentUser?.uid) {
      dispatch(fetchMyEvents(currentUser?.uid));
    }
  }, [dispatch, currentUser?.uid]);

  return (
    <>
      <div className="chat-header">
        <h5>Event Chats</h5>
        <button onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <div className="chat-list">
        {myEventsError && <p className="error">{myEventsError}</p>}

        {!myEventsLoading && !myEventsError && myEvents.length === 0 && (
          <p>No event chats available.</p>
        )}

        {myEventsLoading ? (
          <p>Loading...</p>
        ) : (
          myEvents.map((event) => {
            const unreadCount = unreadByEvent[event.id] || 0;
            
            return (
              <div
                key={event.id}
                className={`chat-item ${unreadCount > 0 ? 'has-unread' : ''}`}
                onClick={() => onSelect(event.id)}
              >
                <IoChatboxSharp /> &nbsp; {event.title}
                {unreadCount > 0 && (
                  <span className="unread-count-badge">{unreadCount}</span>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

export default ChatList;