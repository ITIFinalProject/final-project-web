import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { FaTimes } from "react-icons/fa";
import { IoChatboxSharp } from "react-icons/io5";

function ChatList({ onSelect, onClose }) {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const snap = await getDocs(collection(db, "events"));
            const all = snap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setEvents(all);
        };
        fetchEvents();
    }, []);

    return (
        <>
            <div className="chat-header">
                <h5>Event Chats</h5>
                <button onClick={onClose}>
                    <FaTimes />
                </button>
            </div>
            <div className="chat-list">
                {events.map((event) => (
                    <div
                        key={event.id}
                        className="chat-item"
                        onClick={() => onSelect(event.id)}
                    >
                        <IoChatboxSharp/>&nbsp; {event.title}
                    </div>
                ))}
            </div>
        </>
    );
}

export default ChatList;