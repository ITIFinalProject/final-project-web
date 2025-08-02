import { IoPerson, IoChatbubbles } from "react-icons/io5";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

const HostSection = ({ event, user }) => {
  const [hostData, setHostData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHostData = async () => {
      if (!event?.hostId) {
        setLoading(false);
        return;
      }

      try {
        const hostDoc = await getDoc(doc(db, "users", event.hostId));
        if (hostDoc.exists()) {
          setHostData(hostDoc.data());
        }
      } catch (error) {
        console.error("Error fetching host data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHostData();
  }, [event?.hostId]);

  // Use the passed user prop if available, otherwise use fetched hostData
  const displayUser = user || hostData;
  return (
    <div className="det-host-section">
      <div className="container">
        <div className="det-host-container">
          {/* Host Information */}
          <div className="host-info-card">
            <h3 className="section-title">Hosted by</h3>
            <div className="host-info">
              <div className="host-avatar">
                {displayUser?.imagePath ? (
                  <img src={displayUser.imagePath} alt="Host Avatar" />
                ) : (
                  <IoPerson />
                )}
              </div>
              <h5 className="host-name">
                {event?.hostName || displayUser?.name || "Unknown Host"}
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HostSection;
