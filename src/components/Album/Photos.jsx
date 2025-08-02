// import { useState } from 'react';
// import { FiCamera } from 'react-icons/fi';
// import { FaPlus} from "react-icons/fa";
// import { FaXmark } from "react-icons/fa6";

// const eventImagesData = {
//   "Tech Expo 2025": Array.from({ length: 12 }, (_, i) => ({
//     seed: `tech${i + 1}`,
//     rows: i % 4 === 0 ? 2 : 1,
//     cols: i % 3 === 0 ? 2 : 1,
//     isUploaded: false,
//   })),
//   "Art Festival": Array.from({ length: 10 }, (_, i) => ({
//     seed: `art${i + 1}`,
//     rows: i % 5 === 0 ? 2 : 1,
//     cols: i % 2 === 0 ? 2 : 1,
//     isUploaded: false,
//   })),
//   "Sports Gala": Array.from({ length: 9 }, (_, i) => ({
//     seed: `sports${i + 1}`,
//     rows: i % 3 === 0 ? 2 : 1,
//     cols: i % 4 === 0 ? 2 : 1,
//     isUploaded: false,
//   })),
// };

// const Photos = () => {
//   const [eventImages, setEventImages] = useState(eventImagesData);
//   const [selectedEvent, setSelectedEvent] = useState(Object.keys(eventImagesData)[0]);
//   const [modalImage, setModalImage] = useState(null);

//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);
//     const newImages = files.map((file) => ({
//       src: URL.createObjectURL(file),
//       seed: file.name,
//       rows: 1,
//       cols: 1,
//       isUploaded: true,
//     }));

//     setEventImages((prev) => ({
//       ...prev,
//       [selectedEvent]: [...prev[selectedEvent], ...newImages],
//     }));
//   };

//   return (
//     <div className="album-wrapper">
//       <div className="album-header">
//         <h2><FiCamera /> &nbsp; Memories Album</h2>
//         <div className="album-controls">
//           <select
//             className="event-select"
//             value={selectedEvent}
//             onChange={(e) => setSelectedEvent(e.target.value)}
//           >
//             {Object.keys(eventImages).map((event) => (
//               <option key={event} value={event}>
//                 {event}
//               </option>
//             ))}
//           </select>

//           <label className="upload-label">
//             <FaPlus /> Add Photo
//             <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
//           </label>
//         </div>
//       </div>

//       <div className="album-grid">
//         {eventImages[selectedEvent].map(({ seed, rows, cols, src, isUploaded }, idx) => (
//           <div
//             key={idx}
//             className="album-item"
//             style={{
//               gridRow: `span ${rows}`,
//               gridColumn: `span ${cols}`,
//               minHeight: `${rows * 200}px`,
//             }}
//             onClick={() =>
//               setModalImage(
//                 isUploaded
//                   ? src
//                   : `https://picsum.photos/seed/${seed}/600/400`
//               )
//             }
//           >
//             <img
//               src={isUploaded ? src : `https://picsum.photos/seed/${seed}/600/400`}
//               alt={`Memory ${idx}`}
//             />
//           </div>
//         ))}
//       </div>

//       {modalImage && (
//         <div className="modal-backdrop" onClick={() => setModalImage(null)}>
//           <div className="modal-image-container" onClick={(e) => e.stopPropagation()}>
//             <button className="modal-close" onClick={() => setModalImage(null)}><FaXmark /></button>
//             <img src={modalImage} alt="Preview" />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Photos;
































// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { FiCamera } from 'react-icons/fi';
// import { FaPlus, FaTrash } from "react-icons/fa";
// import { FaXmark } from "react-icons/fa6";
// import { fetchMyEvents } from '../../redux/slices/eventSlice';
// import { collection, addDoc, getDocs, query, where, doc, deleteDoc, updateDoc } from 'firebase/firestore';
// import { db } from '../../firebase/config';
// import { supabase } from '../../lib/sobabase';


// const Photos = () => {
//   const dispatch = useDispatch();

//   // Redux state
//   const { myEvents, myEventsLoading, myEventsError } = useSelector(state => state.events);
//   const currentUserId = useSelector(state => state.auth.currentUser?.uid); // Adjust based on your auth state structure

//   // Local state
//   const [selectedEvent, setSelectedEvent] = useState('');
//   const [selectedEventData, setSelectedEventData] = useState(null);
//   const [eventMemories, setEventMemories] = useState([]);
//   const [modalImage, setModalImage] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [loadingMemories, setLoadingMemories] = useState(false);
//   const [deletingMemory, setDeletingMemory] = useState(null);

//   // Fetch user's events on component mount
//   useEffect(() => {
//     if (currentUserId) {
//       dispatch(fetchMyEvents(currentUserId));
//     }
//   }, [dispatch, currentUserId]);

//   // Set default selected event when events are loaded
//   useEffect(() => {
//     if (myEvents.length > 0 && !selectedEvent) {
//       setSelectedEvent(myEvents[0].id);
//       setSelectedEventData(myEvents[0]);
//     }
//   }, [myEvents, selectedEvent]);

//   // Fetch memories when selected event changes
//   useEffect(() => {
//     if (selectedEvent) {
//       // Clear existing memories first to prevent conflicts
//       setEventMemories([]);
//       fetchEventMemories(selectedEvent);
//     } else {
//       setEventMemories([]);
//     }
//   }, [selectedEvent]);

//   // Function to fetch memories for a specific event
//   const fetchEventMemories = async (eventId) => {
//     setLoadingMemories(true);
//     try {
//       const memoriesRef = collection(db, 'events', eventId, 'memories');
//       const querySnapshot = await getDocs(memoriesRef);

//       const memories = querySnapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));

//       // Sort by creation date (most recent first)
//       const sortedMemories = memories.sort((a, b) => {
//         const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
//         const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
//         return dateB - dateA;
//       });

//       setEventMemories(sortedMemories);
//     } catch (error) {
//       console.error('Error fetching memories:', error);
//       setEventMemories([]); // Clear memories on error
//     } finally {
//       setLoadingMemories(false);
//     }
//   };

//   // Function to upload image to Supabase
//   const uploadImageToSupabase = async (file) => {
//     const fileExt = file.name.split('.').pop();
//     const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
//     const filePath = `memories/${fileName}`;

//     const { data, error } = await supabase.storage
//       .from('memories') // Make sure this bucket exists in Supabase
//       .upload(filePath, file);

//     if (error) {
//       throw error;
//     }

//     // Get public URL
//     const { data: { publicUrl } } = supabase.storage
//       .from('memories')
//       .getPublicUrl(filePath);

//     return { publicUrl, filePath };
//   };

//   const saveMemoryToFirestore = async (eventId, url, type, filePath) => {
//     try {
//       const memoriesRef = collection(db, 'events', eventId, 'memories');
//       const docRef = await addDoc(memoriesRef, {
//         url,
//         type,
//         filePath,
//         createdAt: new Date(),
//         uploadedBy: currentUserId
//       });

//       // optionally update the document to include its ID
//       await updateDoc(docRef, { id: docRef.id });
//     } catch (error) {
//       console.error('Error saving memory to Firestore:', error);
//       throw error;
//     }
//   };


//   // Function to delete image from Supabase
//   const deleteImageFromSupabase = async (filePath) => {
//     try {
//       const { error } = await supabase.storage
//         .from('memories')
//         .remove([filePath]);

//       if (error) {
//         console.error('Error deleting from Supabase:', error);
//         // Don't throw error here as the Firestore deletion is more important
//       }
//     } catch (error) {
//       console.error('Error deleting from Supabase:', error);
//     }
//   };

//   // Function to delete memory from Firestore
//   const deleteMemoryFromFirestore = async (eventId, memoryId) => {
//     try {
//       const memoryRef = doc(db, 'events', eventId, 'memories', memoryId);

//       await deleteDoc(memoryRef);
//     } catch (error) {
//       console.error('Error deleting memory from Firestore:', error);
//       throw error;
//     }
//   };

//   // Function to check if current user is the host of the selected event
//   const isCurrentUserHost = () => {
//     if (!selectedEventData || !currentUserId) return false;
//     return selectedEventData.hostId === currentUserId || selectedEventData.createdBy === currentUserId;
//   };

//   // Handle memory deletion
//   const handleDeleteMemory = async (memory) => {
//     if (!isCurrentUserHost()) {
//       alert('Only the event host can delete memories.');
//       return;
//     }

//     const confirmDelete = window.confirm('Are you sure you want to delete this memory?');
//     if (!confirmDelete) return;

//     setDeletingMemory(memory.id);

//     try {
//       // Delete from Firestore first
//       await deleteMemoryFromFirestore(selectedEvent, memory.id);

//       // Then delete from Supabase if filePath exists
//       if (memory.filePath) {
//         await deleteImageFromSupabase(memory.filePath);
//       }

//       // Refresh memories
//       await fetchEventMemories(selectedEvent);

//       // Close modal if the deleted memory was being viewed
//       if (modalImage && modalImage.id === memory.id) {
//         setModalImage(null);
//       }

//     } catch (error) {
//       console.error('Error deleting memory:', error);
//       alert('Error deleting memory. Please try again.');
//     } finally {
//       setDeletingMemory(null);
//     }
//   };

//   // Function to determine file type
//   const getFileType = (file) => {
//     if (file.type.startsWith('image/')) return 'image';
//     if (file.type.startsWith('video/')) return 'video';
//     return 'image'; // default
//   };

//   // Handle image/video upload
//   const handleImageUpload = async (e) => {
//     const files = Array.from(e.target.files);
//     if (!files.length || !selectedEvent) return;

//     setUploading(true);

//     try {
//       for (const file of files) {
//         // Upload to Supabase
//         const { publicUrl, filePath } = await uploadImageToSupabase(file);

//         // Determine file type
//         const type = getFileType(file);

//         // Save to Firestore
//         await saveMemoryToFirestore(selectedEvent, publicUrl, type, filePath);
//       }

//       // Refresh memories for the current event
//       await fetchEventMemories(selectedEvent);

//       // Clear the input
//       e.target.value = '';

//     } catch (error) {
//       console.error('Error uploading files:', error);
//       alert('Error uploading files. Please try again.');
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Handle event selection change
//   const handleEventChange = (e) => {
//     const eventId = e.target.value;
//     setSelectedEvent(eventId);

//     // Find and set the selected event data
//     const eventData = myEvents.find(event => event.id === eventId);
//     setSelectedEventData(eventData);
//   };

//   // Get selected event name for display
//   const getSelectedEventName = () => {
//     const event = myEvents.find(event => event.id === selectedEvent);
//     return event ? event.name || event.title : '';
//   };

//   if (myEventsLoading) {
//     return (
//       <div className="loading-container">
//         <div className="loading-text">Loading your events...</div>
//       </div>
//     );
//   }

//   if (myEventsError) {
//     return (
//       <div className="error-container">
//         <div className="error-text">Error loading events: {myEventsError}</div>
//       </div>
//     );
//   }

//   if (!myEvents.length) {
//     return (
//       <div className="empty-container">
//         <div className="empty-text">You don't have any events yet.</div>
//       </div>
//     );
//   }

//   return (
//     <div className="photos-container">
//       <div className="photos-wrapper">
//         {/* Header */}
//         <div className="header-section">
//           <h1 className="main-title"><FiCamera style={{ color: "#1b3c53" }} /> Memories Album</h1>

//           {/* Event Selector */}
//           <div className="controls-section">
//             <select
//               value={selectedEvent}
//               onChange={handleEventChange}
//               className="event-selector"
//             >
//               <option value="">Select an event</option>
//               {myEvents.map((event) => (
//                 <option key={event.id} value={event.id}>
//                   {event.name || event.title}
//                 </option>
//               ))}
//             </select>

//             {/* Upload Button */}
//             {selectedEvent && (
//               <label className={`upload-button ${uploading ? 'uploading' : ''}`}>
//                 {uploading ? (
//                   <>
//                     <div className="spinner"></div>
//                     Uploading...
//                   </>
//                 ) : (
//                   <>
//                     <FaPlus />
//                     Add Photo/Video
//                   </>
//                 )}
//                 <input
//                   type="file"
//                   multiple
//                   accept="image/*,video/*"
//                   onChange={handleImageUpload}
//                   className="file-input"
//                   disabled={uploading}
//                 />
//               </label>
//             )}
//           </div>
//         </div>

//         {/* Selected Event Display */}
//         {selectedEvent && (
//           <div className="event-title-section">
//             <h2 className="event-title">
//               {getSelectedEventName()} Memories
//             </h2>
//             {isCurrentUserHost() && (
//               <div className="host-indicator">
//                 <small>You are the host - you can delete memories</small>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Memories Grid */}
//         {selectedEvent && (
//           <div className="memories-grid">
//             {loadingMemories ? (
//               <div className="memories-loading">
//                 <div className="memories-spinner"></div>
//               </div>
//             ) : eventMemories.length === 0 ? (
//               <div className="no-memories">
//                 No memories yet. Upload some photos or videos!
//               </div>
//             ) : (
//               eventMemories.map((memory) => (
//                 <div
//                   key={memory.id}
//                   className="memory-card"
//                 >
//                   <div
//                     className="memory-media-container"
//                     onClick={() => setModalImage(memory)}
//                   >
//                     {memory.type === 'video' ? (
//                       <video
//                         src={memory.url}
//                         className="memory-media"
//                         controls={false}
//                         muted
//                       />
//                     ) : (
//                       <img
//                         src={memory.url}
//                         alt="Memory"
//                         className="memory-media"
//                         loading="lazy"
//                       />
//                     )}
//                   </div>

                  

//                   <div className="memory-info">
//                     <span className="memory-type">
//                       {memory.type}
//                     </span>
//                     {/* Delete button - only show for host */}
//                   {isCurrentUserHost() && (
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleDeleteMemory(memory);
//                       }}
//                       className={`delete-memory-btn ${deletingMemory === memory.id ? 'deleting' : ''}`}
//                       disabled={deletingMemory === memory.id}
//                       title="Delete memory"
//                     >
//                       {deletingMemory === memory.id ? (
//                         <div className="delete-spinner"></div>
//                       ) : (
//                         <FaTrash />
//                       )}
//                     </button>
//                   )}
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         )}

//         {/* Modal */}
//         {modalImage && (
//           <div className="modal-overlay" onClick={() => setModalImage(null)}>
//             <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//               <div className="modal-header">
//                 <button
//                   onClick={() => setModalImage(null)}
//                   className="modal-close-btn"
//                 >
//                   <FaXmark className="close-icon" />
//                 </button>

//               </div>

//               {modalImage.type === 'video' ? (
//                 <video
//                   src={modalImage.url}
//                   className="modal-media"
//                   controls
//                   autoPlay
//                 />
//               ) : (
//                 <img
//                   src={modalImage.url}
//                   alt="Memory"
//                   className="modal-media"
//                 />
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Photos;





import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiCamera } from 'react-icons/fi';
import { FaPlus, FaTrash } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { fetchMyEvents } from '../../redux/slices/eventSlice';
import { collection, addDoc, getDocs, query, where, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { supabase } from '../../lib/sobabase';


const Photos = () => {
  const dispatch = useDispatch();

  // Redux state
  const { myEvents, myEventsLoading, myEventsError } = useSelector(state => state.events);
  const currentUserId = useSelector(state => state.auth.currentUser?.uid);

  // Local state
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedEventData, setSelectedEventData] = useState(null);
  const [eventMemories, setEventMemories] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loadingMemories, setLoadingMemories] = useState(false);
  const [deletingMemory, setDeletingMemory] = useState(null);

  // Fetch user's events on component mount
  useEffect(() => {
    if (currentUserId) {
      dispatch(fetchMyEvents(currentUserId));
    }
  }, [dispatch, currentUserId]);

  // Set default selected event when events are loaded
  useEffect(() => {
    if (myEvents.length > 0 && !selectedEvent) {
      setSelectedEvent(myEvents[0].id);
      setSelectedEventData(myEvents[0]);
    }
  }, [myEvents, selectedEvent]);

  // Fetch memories when selected event changes
  useEffect(() => {
    if (selectedEvent) {
      setEventMemories([]);
      fetchEventMemories(selectedEvent);
    } else {
      setEventMemories([]);
    }
  }, [selectedEvent]);

  // Function to fetch memories for a specific event
  const fetchEventMemories = async (eventId) => {
    setLoadingMemories(true);
    try {
      const memoriesRef = collection(db, 'events', eventId, 'memories');
      const querySnapshot = await getDocs(memoriesRef);

      const memories = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by creation date (most recent first)
      const sortedMemories = memories.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
        return dateB - dateA;
      });

      setEventMemories(sortedMemories);
    } catch (error) {
      console.error('Error fetching memories:', error);
      setEventMemories([]);
    } finally {
      setLoadingMemories(false);
    }
  };

  // Function to upload image to Supabase
  const uploadImageToSupabase = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `memories/${fileName}`;

    const { data, error } = await supabase.storage
      .from('memories')
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('memories')
      .getPublicUrl(filePath);

    return { publicUrl, filePath };
  };

  const saveMemoryToFirestore = async (eventId, url, type, filePath) => {
    try {
      const memoriesRef = collection(db, 'events', eventId, 'memories');
      const docRef = await addDoc(memoriesRef, {
        url,
        type,
        filePath,
        createdAt: new Date(),
        uploadedBy: currentUserId
      });

      await updateDoc(docRef, { id: docRef.id });
    } catch (error) {
      console.error('Error saving memory to Firestore:', error);
      throw error;
    }
  };

  // Function to delete image from Supabase
  const deleteImageFromSupabase = async (filePath) => {
    try {
      const { error } = await supabase.storage
        .from('memories')
        .remove([filePath]);

      if (error) {
        console.error('Error deleting from Supabase:', error);
      }
    } catch (error) {
      console.error('Error deleting from Supabase:', error);
    }
  };

  // Function to delete memory from Firestore
  const deleteMemoryFromFirestore = async (eventId, memoryId) => {
    try {
      const memoryRef = doc(db, 'events', eventId, 'memories', memoryId);
      await deleteDoc(memoryRef);
    } catch (error) {
      console.error('Error deleting memory from Firestore:', error);
      throw error;
    }
  };

  // Function to check if current user is the host of the selected event
  const isCurrentUserHost = () => {
    if (!selectedEventData || !currentUserId) return false;
    return selectedEventData.hostId === currentUserId || selectedEventData.createdBy === currentUserId;
  };

  // Handle memory deletion
  const handleDeleteMemory = async (memory) => {
    if (!isCurrentUserHost()) {
      alert('Only the event host can delete memories.');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this memory?');
    if (!confirmDelete) return;

    setDeletingMemory(memory.id);

    try {
      await deleteMemoryFromFirestore(selectedEvent, memory.id);

      if (memory.filePath) {
        await deleteImageFromSupabase(memory.filePath);
      }

      await fetchEventMemories(selectedEvent);

      if (modalImage && modalImage.id === memory.id) {
        setModalImage(null);
      }

    } catch (error) {
      console.error('Error deleting memory:', error);
      alert('Error deleting memory. Please try again.');
    } finally {
      setDeletingMemory(null);
    }
  };

  // Function to determine file type
  const getFileType = (file) => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'image';
  };

  // Handle image/video upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length || !selectedEvent) return;

    setUploading(true);

    try {
      for (const file of files) {
        const { publicUrl, filePath } = await uploadImageToSupabase(file);
        const type = getFileType(file);
        await saveMemoryToFirestore(selectedEvent, publicUrl, type, filePath);
      }

      await fetchEventMemories(selectedEvent);
      e.target.value = '';

    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Handle event selection change
  const handleEventChange = (e) => {
    const eventId = e.target.value;
    setSelectedEvent(eventId);
    const eventData = myEvents.find(event => event.id === eventId);
    setSelectedEventData(eventData);
  };

  // Get selected event name for display
  const getSelectedEventName = () => {
    const event = myEvents.find(event => event.id === selectedEvent);
    return event ? event.name || event.title : '';
  };

  if (myEventsLoading) {
    return (
      <div className="album-wrapper">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '16rem' }}>
          <div style={{ fontSize: '1.125rem', color: '#4a5568', fontWeight: '500' }}>
            Loading your events...
          </div>
        </div>
      </div>
    );
  }

  if (myEventsError) {
    return (
      <div className="album-wrapper">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '16rem' }}>
          <div style={{ color: '#e53e3e', fontWeight: '500' }}>
            Error loading events: {myEventsError}
          </div>
        </div>
      </div>
    );
  }

  if (!myEvents.length) {
    return (
      <div className="album-wrapper">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '16rem' }}>
          <div style={{ color: '#718096', fontSize: '1.125rem' }}>
            You don't have any events yet.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="album-wrapper">
      {/* Header */}
      <div className="album-header">
        <h2><FiCamera /> &nbsp; Memories Album</h2>
        <div className="album-controls">
          <select
            className="event-select"
            value={selectedEvent}
            onChange={handleEventChange}
          >
            <option value="">Select an event</option>
            {myEvents.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name || event.title}
              </option>
            ))}
          </select>

          {/* Upload Button */}
          {selectedEvent && (
            <label className={`upload-label ${uploading ? 'uploading' : ''}`}>
              {uploading ? (
                <>
                  <div className="spinner"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <FaPlus /> Add Photo/Video
                </>
              )}
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
          )}
        </div>
      </div>

      {/* Selected Event Display */}
      {selectedEvent && (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {getSelectedEventName()} Memories
          </h3>
          {isCurrentUserHost() && (
            <div style={{ marginTop: '0.5rem' }}>
              <small style={{ color: 'var(--text-secondary)' }}>
                You are the host - you can delete memories
              </small>
            </div>
          )}
        </div>
      )}

      {/* Memories Grid */}
      {selectedEvent && (
        <div className="album-grid">
          {loadingMemories ? (
            <div style={{ 
              gridColumn: '1 / -1', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '8rem' 
            }}>
              <div className="spinner" style={{ 
                width: '2rem', 
                height: '2rem', 
                border: '3px solid rgba(0,0,0,0.1)', 
                borderTop: '3px solid var(--primary-blue)', 
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          ) : eventMemories.length === 0 ? (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              color: 'var(--text-secondary)', 
              padding: '3rem',
              fontSize: '1.2rem',
              fontWeight: '500'
            }}>
              No memories yet. Upload some photos or videos!
            </div>
          ) : (
            eventMemories.map((memory, idx) => (
              <div
                key={memory.id}
                className="album-item"
                style={{
                  gridRow: `span ${idx % 4 === 0 ? 2 : 1}`,
                  gridColumn: `span ${idx % 3 === 0 ? 2 : 1}`,
                  minHeight: `${(idx % 4 === 0 ? 2 : 1) * 200}px`,
                  position: 'relative'
                }}
                onClick={() => setModalImage(memory)}
              >
                {memory.type === 'video' ? (
                  <video
                    src={memory.url}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    muted
                  />
                ) : (
                  <img
                    src={memory.url}
                    alt={`Memory ${idx}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    loading="lazy"
                  />
                )}
                
                {/* Delete button - only show for host */}
                {isCurrentUserHost() && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMemory(memory);
                    }}
                    className="delete-memory-btn"
                    disabled={deletingMemory === memory.id}
                    title="Delete memory"
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                      transition: 'all 0.2s ease',
                      color: '#e53e3e'
                    }}
                  >
                    {deletingMemory === memory.id ? (
                      <div className="spinner" style={{ 
                        width: '16px', 
                        height: '16px', 
                        border: '2px solid rgba(229, 62, 62, 0.2)', 
                        borderTop: '2px solid #e53e3e', 
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                    ) : (
                      <FaTrash size={14} />
                    )}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {modalImage && (
        <div className="modal-backdrop" onClick={() => setModalImage(null)}>
          <div className="modal-image-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalImage(null)}>
              <FaXmark />
            </button>

            
            {modalImage.type === 'video' ? (
              <video
                src={modalImage.url}
                controls
                autoPlay
                style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px', display: 'block' }}
              />
            ) : (
              <img
                src={modalImage.url}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px', display: 'block' }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Photos;