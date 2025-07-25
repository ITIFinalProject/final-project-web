import { useState } from 'react';
import '../styles/album.css';
import { FiCamera } from 'react-icons/fi';
import { FaPlus} from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

const eventImagesData = {
  "Tech Expo 2025": Array.from({ length: 12 }, (_, i) => ({
    seed: `tech${i + 1}`,
    rows: i % 4 === 0 ? 2 : 1,
    cols: i % 3 === 0 ? 2 : 1,
    isUploaded: false,
  })),
  "Art Festival": Array.from({ length: 10 }, (_, i) => ({
    seed: `art${i + 1}`,
    rows: i % 5 === 0 ? 2 : 1,
    cols: i % 2 === 0 ? 2 : 1,
    isUploaded: false,
  })),
  "Sports Gala": Array.from({ length: 9 }, (_, i) => ({
    seed: `sports${i + 1}`,
    rows: i % 3 === 0 ? 2 : 1,
    cols: i % 4 === 0 ? 2 : 1,
    isUploaded: false,
  })),
};

const Album = () => {
  const [eventImages, setEventImages] = useState(eventImagesData);
  const [selectedEvent, setSelectedEvent] = useState(Object.keys(eventImagesData)[0]);
  const [modalImage, setModalImage] = useState(null);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      src: URL.createObjectURL(file),
      seed: file.name,
      rows: 1,
      cols: 1,
      isUploaded: true,
    }));

    setEventImages((prev) => ({
      ...prev,
      [selectedEvent]: [...prev[selectedEvent], ...newImages],
    }));
  };

  return (
    <div className="album-wrapper">
      <div className="album-header">
        <h2><FiCamera /> &nbsp;&nbsp; Memories Album</h2>
        <div className="album-controls">
          <select
            className="event-select"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
          >
            {Object.keys(eventImages).map((event) => (
              <option key={event} value={event}>
                {event}
              </option>
            ))}
          </select>

          <label className="upload-label">
            <FaPlus /> Add Photo
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
          </label>
        </div>
      </div>

      <div className="album-grid">
        {eventImages[selectedEvent].map(({ seed, rows, cols, src, isUploaded }, idx) => (
          <div
            key={idx}
            className="album-item"
            style={{
              gridRow: `span ${rows}`,
              gridColumn: `span ${cols}`,
              minHeight: `${rows * 200}px`,
            }}
            onClick={() =>
              setModalImage(
                isUploaded
                  ? src
                  : `https://picsum.photos/seed/${seed}/600/400`
              )
            }
          >
            <img
              src={isUploaded ? src : `https://picsum.photos/seed/${seed}/600/400`}
              alt={`Memory ${idx}`}
            />
          </div>
        ))}
      </div>

      {modalImage && (
        <div className="modal-backdrop" onClick={() => setModalImage(null)}>
          <div className="modal-image-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalImage(null)}><FaXmark /></button>
            <img src={modalImage} alt="Preview" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Album;
