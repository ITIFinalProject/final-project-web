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
// import { FaPlus } from "react-icons/fa";
// import { FaXmark } from "react-icons/fa6";
// import { fetchMyEvents } from '../../redux/slices/eventSlice'; // Update this path
// import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
// import { db } from '../../firebase/config'; // Update this path
// import { supabase } from '../../lib/sobabase'; 

// // // Initialize Supabase client
// // const supabaseUrl = 'YOUR_SUPABASE_URL';
// // const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';


// const Photos = () => {
//   const dispatch = useDispatch();
  
//   // Redux state
//   const { myEvents, myEventsLoading, myEventsError } = useSelector(state => state.events);
//   const currentUserId = useSelector(state => state.auth.currentUser?.uid); // Adjust based on your auth state structure
  
//   // Local state
//   const [selectedEvent, setSelectedEvent] = useState('');
//   const [eventMemories, setEventMemories] = useState([]);
//   const [modalImage, setModalImage] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [loadingMemories, setLoadingMemories] = useState(false);

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
//     }
//   }, [myEvents, selectedEvent]);

//   // Fetch memories when selected event changes
//   useEffect(() => {
//     if (selectedEvent) {
//       fetchEventMemories(selectedEvent);
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
      
//       setEventMemories(memories);
//     } catch (error) {
//       console.error('Error fetching memories:', error);
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

//     return publicUrl;
//   };

//   // Function to save memory to Firestore
//   const saveMemoryToFirestore = async (eventId, url, type) => {
//     try {
//       const memoriesRef = collection(db, 'events', eventId, 'memories');
//       await addDoc(memoriesRef, {
//         url,
//         type,
//         id: eventId,
//         createdAt: new Date(),
//         uploadedBy: currentUserId
//       });
//     } catch (error) {
//       console.error('Error saving memory to Firestore:', error);
//       throw error;
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
//         const url = await uploadImageToSupabase(file);
        
//         // Determine file type
//         const type = getFileType(file);
        
//         // Save to Firestore
//         await saveMemoryToFirestore(selectedEvent, url, type);
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
//     setSelectedEvent(e.target.value);
//   };

//   // Get selected event name for display
//   const getSelectedEventName = () => {
//     const event = myEvents.find(event => event.id === selectedEvent);
//     return event ? event.name || event.title : '';
//   };

//   if (myEventsLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-lg">Loading your events...</div>
//       </div>
//     );
//   }

//   if (myEventsError) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-red-500">Error loading events: {myEventsError}</div>
//       </div>
//     );
//   }

//   if (!myEvents.length) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-gray-500">You don't have any events yet.</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-800 mb-4">📸 Memories Album</h1>
          
//           {/* Event Selector */}
//           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
//             <select
//               value={selectedEvent}
//               onChange={handleEventChange}
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
//               <label className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg cursor-pointer flex items-center gap-2 transition-colors disabled:opacity-50">
//                 {uploading ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                     Uploading...
//                   </>
//                 ) : (
//                   <>
//                     <FaPlus size={16} />
//                     Add Photo/Video
//                   </>
//                 )}
//                 <input
//                   type="file"
//                   multiple
//                   accept="image/*,video/*"
//                   onChange={handleImageUpload}
//                   className="hidden"
//                   disabled={uploading}
//                 />
//               </label>
//             )}
//           </div>
//         </div>

//         {/* Selected Event Display */}
//         {selectedEvent && (
//           <div className="text-center mb-6">
//             <h2 className="text-2xl font-semibold text-gray-700">
//               {getSelectedEventName()} Memories
//             </h2>
//           </div>
//         )}

//         {/* Memories Grid */}
//         {selectedEvent && (
//           <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
//             {loadingMemories ? (
//               <div className="col-span-full flex justify-center items-center h-32">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
//               </div>
//             ) : eventMemories.length === 0 ? (
//               <div className="col-span-full text-center text-gray-500 py-12">
//                 No memories yet. Upload some photos or videos!
//               </div>
//             ) : (
//               eventMemories.map((memory) => (
//                 <div
//                   key={memory.id}
//                   className="break-inside-avoid mb-4 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
//                   onClick={() => setModalImage(memory)}
//                 >
//                   {memory.type === 'video' ? (
//                     <video
//                       src={memory.url}
//                       className="w-full h-auto object-cover"
//                       controls={false}
//                       muted
//                     />
//                   ) : (
//                     <img
//                       src={memory.url}
//                       alt="Memory"
//                       className="w-full h-auto object-cover"
//                       loading="lazy"
//                     />
//                   )}
//                   <div className="p-2">
//                     <span className="text-xs text-gray-500 capitalize">
//                       {memory.type}
//                     </span>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         )}

//         {/* Modal */}
//         {modalImage && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
//             onClick={() => setModalImage(null)}
//           >
//             <div
//               className="relative max-w-4xl max-h-full"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <button
//                 onClick={() => setModalImage(null)}
//                 className="absolute -top-4 -right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors z-10"
//               >
//                 <FaXmark size={20} />
//               </button>
              
//               {modalImage.type === 'video' ? (
//                 <video
//                   src={modalImage.url}
//                   className="max-w-full max-h-full rounded-lg"
//                   controls
//                   autoPlay
//                 />
//               ) : (
//                 <img
//                   src={modalImage.url}
//                   alt="Memory"
//                   className="max-w-full max-h-full rounded-lg"
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
import { FaPlus } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { fetchMyEvents } from '../../redux/slices/eventSlice'; 
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config'; 
import { supabase } from '../../lib/sobabase'; 


const Photos = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const { myEvents, myEventsLoading, myEventsError } = useSelector(state => state.events);
  const currentUserId = useSelector(state => state.auth.currentUser?.uid); // Adjust based on your auth state structure
  
  // Local state
  const [selectedEvent, setSelectedEvent] = useState('');
  const [eventMemories, setEventMemories] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loadingMemories, setLoadingMemories] = useState(false);

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
    }
  }, [myEvents, selectedEvent]);

  // Fetch memories when selected event changes
  useEffect(() => {
    if (selectedEvent) {
      fetchEventMemories(selectedEvent);
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
      
      setEventMemories(memories);
    } catch (error) {
      console.error('Error fetching memories:', error);
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
      .from('memories') // Make sure this bucket exists in Supabase
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('memories')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  // Function to save memory to Firestore
  const saveMemoryToFirestore = async (eventId, url, type) => {
    try {
      const memoriesRef = collection(db, 'events', eventId, 'memories');
      await addDoc(memoriesRef, {
        url,
        type,
        id: eventId,
        createdAt: new Date(),
        uploadedBy: currentUserId
      });
    } catch (error) {
      console.error('Error saving memory to Firestore:', error);
      throw error;
    }
  };

  // Function to determine file type
  const getFileType = (file) => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'image'; // default
  };

  // Handle image/video upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length || !selectedEvent) return;

    setUploading(true);
    
    try {
      for (const file of files) {
        // Upload to Supabase
        const url = await uploadImageToSupabase(file);
        
        // Determine file type
        const type = getFileType(file);
        
        // Save to Firestore
        await saveMemoryToFirestore(selectedEvent, url, type);
      }
      
      // Refresh memories for the current event
      await fetchEventMemories(selectedEvent);
      
      // Clear the input
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
    setSelectedEvent(e.target.value);
  };

  // Get selected event name for display
  const getSelectedEventName = () => {
    const event = myEvents.find(event => event.id === selectedEvent);
    return event ? event.name || event.title : '';
  };

  if (myEventsLoading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading your events...</div>
      </div>
    );
  }

  if (myEventsError) {
    return (
      <div className="error-container">
        <div className="error-text">Error loading events: {myEventsError}</div>
      </div>
    );
  }

  if (!myEvents.length) {
    return (
      <div className="empty-container">
        <div className="empty-text">You don't have any events yet.</div>
      </div>
    );
  }

  return (
    <div className="photos-container">
      <div className="photos-wrapper">
        {/* Header */}
        <div className="header-section">
          <h1 className="main-title"><FiCamera style={{color:"#1b3c53"}}/> Memories Album</h1>
          
          {/* Event Selector */}
          <div className="controls-section">
            <select
              value={selectedEvent}
              onChange={handleEventChange}
              className="event-selector"
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
              <label className={`upload-button ${uploading ? 'uploading' : ''}`}>
                {uploading ? (
                  <>
                    <div className="spinner"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <FaPlus  />
                    Add Photo/Video
                  </>
                )}
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleImageUpload}
                  className="file-input"
                  disabled={uploading}
                />
              </label>
            )}
          </div>
        </div>

        {/* Selected Event Display */}
        {selectedEvent && (
          <div className="event-title-section">
            <h2 className="event-title">
              {getSelectedEventName()} Memories
            </h2>
          </div>
        )}

        {/* Memories Grid */}
        {selectedEvent && (
          <div className="memories-grid">
            {loadingMemories ? (
              <div className="memories-loading">
                <div className="memories-spinner"></div>
              </div>
            ) : eventMemories.length === 0 ? (
              <div className="no-memories">
                No memories yet. Upload some photos or videos!
              </div>
            ) : (
              eventMemories.map((memory) => (
                <div
                  key={memory.id}
                  className="memory-card"
                  onClick={() => setModalImage(memory)}
                >
                  {memory.type === 'video' ? (
                    <video
                      src={memory.url}
                      className="memory-media"
                      controls={false}
                      muted
                    />
                  ) : (
                    <img
                      src={memory.url}
                      alt="Memory"
                      className="memory-media"
                      loading="lazy"
                    />
                  )}
                  <div className="memory-info">
                    <span className="memory-type">
                      {memory.type}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal */}
        {modalImage && (
          <div className="modal-overlay" onClick={() => setModalImage(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setModalImage(null)}
                className="modal-close-btn"
              >
                <FaXmark className="close-icon" />
              </button>
              
              {modalImage.type === 'video' ? (
                <video
                  src={modalImage.url}
                  className="modal-media"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={modalImage.url}
                  alt="Memory"
                  className="modal-media"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Photos;