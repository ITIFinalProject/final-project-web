// import { useState } from 'react';
// import { supabase } from '../../lib/sobabase';

// const CreateBanner = ({ imageUrl, setImageUrl, onBack }) => {
//   const [imageFile, setImageFile] = useState(null);
//   const [preview, setPreview] = useState(imageUrl || null);
//   const [uploading, setUploading] = useState(false);

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (!file.name.toLowerCase().endsWith('.jpg')) {
//       alert('Only .jpg images are allowed!');
//       return;
//     }

//     setImageFile(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   const handleUpload = async () => {
//     if (!imageFile) return alert('Please select a .jpg image to upload.');

//     try {
//       setUploading(true);

//       const fileName = `${Date.now()}.jpg`;
//       const filePath = `public/${fileName}`;

//       const { error: uploadError } = await supabase.storage
//         .from('event-images')
//         .upload(filePath, imageFile, {
//           contentType: 'image/jpeg',
//           upsert: false,
//         });

//       if (uploadError) throw uploadError;

//       const { data: urlData } = supabase.storage
//         .from('event-images')
//         .getPublicUrl(filePath);

//       if (urlData?.publicUrl) {
//         setImageUrl(urlData.publicUrl); // this triggers state update in parent
//       } else {
//         throw new Error('Failed to get public URL from Supabase.');
//       }
//     } catch (error) {
//       console.error('Image upload failed:', error.message);
//       alert('Image upload failed. Please try again.');
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="create-banner-step">
//       <h3>Upload Event Banner</h3>

//       {preview && (
//         <img src={preview} alt="Banner Preview" className="banner-preview" />
//       )}

//       <input type="file" accept=".jpg" onChange={handleFileChange} />

//       <div>
//         <button onClick={onBack} disabled={uploading} className='back-btn'>
//           Back
//         </button>
//         &nbsp;
//         &nbsp;
//         &nbsp;
//         <button onClick={handleUpload} disabled={uploading} className='save-btn'>
//           {uploading ? 'Uploading...' : 'Continue'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CreateBanner;






import { useState } from 'react'; 
import { supabase } from '../../lib/sobabase'; 
 
const CreateBanner = ({ imageUrl, setImageUrl, onBack }) => { 
  const [imageFile, setImageFile] = useState(null); 
  const [preview, setPreview] = useState(imageUrl || null); 
  const [uploading, setUploading] = useState(false); 
  const [dragActive, setDragActive] = useState(false);
 
  const handleFileChange = (e) => { 
    const file = e.target.files?.[0]; 
    if (!file) return; 
 
    if (!file.name.toLowerCase().endsWith('.jpg')) { 
      alert('Only .jpg images are allowed!'); 
      return; 
    } 
 
    setImageFile(file); 
    setPreview(URL.createObjectURL(file)); 
  }; 

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.name.toLowerCase().endsWith('.jpg')) {
        alert('Only .jpg images are allowed!');
        return;
      }
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };
 
  const handleUpload = async () => { 
    if (!imageFile) return alert('Please select a .jpg image to upload.'); 
 
    try { 
      setUploading(true); 
 
      const fileName = `${Date.now()}.jpg`; 
      const filePath = `public/${fileName}`; 
 
      const { error: uploadError } = await supabase.storage 
        .from('event-images') 
        .upload(filePath, imageFile, { 
          contentType: 'image/jpeg', 
          upsert: false, 
        }); 
 
      if (uploadError) throw uploadError; 
 
      const { data: urlData } = supabase.storage 
        .from('event-images') 
        .getPublicUrl(filePath); 
 
      if (urlData?.publicUrl) { 
        setImageUrl(urlData.publicUrl);
      } else { 
        throw new Error('Failed to get public URL from Supabase.'); 
      } 
    } catch (error) { 
      console.error('Image upload failed:', error.message); 
      alert('Image upload failed. Please try again.'); 
    } finally { 
      setUploading(false); 
    } 
  }; 
 
  return ( 
    <div className="create-banner-container"> 
      <div className="banner-header">
        <h2>Upload Event Banner</h2>
        <p>Choose a high-quality JPG image for your event banner</p>
      </div>
 
      <div className="banner-content">
        {preview ? (
          <div className="preview-container">
            <div className="image-preview">
              <img src={preview} alt="Banner Preview" />
              <div className="preview-overlay">
                <button 
                  className="change-image-btn"
                  onClick={() => document.getElementById('file-input').click()}
                  disabled={uploading}
                >
                  Change Image
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div 
            className={`upload-area ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
          >
            <div className="upload-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 10L12 5L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 5V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="upload-text">
              <h3>Drop your image here</h3>
              <p>or <span className="browse-text">browse files</span></p>
              <small>Only JPG files are supported</small>
            </div>
          </div>
        )}

        <input 
          id="file-input"
          type="file" 
          accept=".jpg" 
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
 
      <div className="banner-actions"> 
        <button 
          onClick={onBack} 
          disabled={uploading} 
          className="btn btn-secondary"
        > 
          Back 
        </button> 
        <button 
          onClick={handleUpload} 
          disabled={uploading || !imageFile} 
          className="btn btn-primary"
        > 
          {uploading ? (
            <>
              <span className="loading-spinner"></span>
              Uploading...
            </>
          ) : (
            'Continue'
          )}
        </button> 
      </div> 
    </div> 
  ); 
}; 
 
export default CreateBanner;