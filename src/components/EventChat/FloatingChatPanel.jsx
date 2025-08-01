import { useState } from "react";
import ChatList from "./ChatList";
import MainChat from "./MainChat";
import { auth } from "../../firebase/config";
import "../../styles/eventChat.css";
import { useSelector } from "react-redux";

function FloatingChatPanel() {
    const [activeChatId, setActiveChatId] = useState(null); // selected event/chat
    const [isExpanded, setIsExpanded] = useState(false); // panel expanded state
    const user = auth.currentUser;
  const { currentUser } = useSelector((state) => state.auth);

    const togglePanel = () => {
        setIsExpanded(!isExpanded);
        // Reset chat selection when closing
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
            {
                currentUser ?
                    <div className={`floating-chat-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
                        {!isExpanded ? (
                            // Collapsed state - show chat icon
                            <div onClick={togglePanel} style={{ cursor: 'pointer' }}>
                                Chats
                            </div>
                        ) : (
                            // Expanded state - show chat interface
                            <>
                                {!activeChatId ? (
                                    <ChatList
                                        onSelect={handleChatSelect}
                                        onClose={togglePanel}
                                    />
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
                    : null
            }
        </>
    );
}

export default FloatingChatPanel;