// import { useState } from 'react';
// import { supabase } from '../../lib/sobabase';

// const CreateBanner = ({ imageUrl, setImageUrl, onBack }) => {
//   const [imageFile, setImageFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setImageFile(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   const handleUpload = async () => {
//     if (!imageFile) return alert('Please select an image');

//     try {
//       setUploading(true);

//       const fileExt = imageFile.name.split('.').pop();
//       const fileName = `${Date.now()}.${fileExt}`;
//       const filePath = `public/${fileName}`;

//       const { error: uploadError } = await supabase.storage
//         .from('event-images')
//         .upload(filePath, imageFile, {
//           contentType: imageFile.type,
//           upsert: false,
//         });

//       if (uploadError) throw uploadError;

//       const { data: urlData } = supabase.storage
//         .from('event-images')
//         .getPublicUrl(filePath);

//       if (typeof setImageUrl === 'function') {
//         setImageUrl(urlData.publicUrl);
//       } else {
//         console.warn('setImageUrl is not a function');
//       }

//     ();
//     } catch (error) {
//       console.error('Image upload failed:', error.message);
//       alert(`Failed to upload image: ${error.message}`);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="create-banner-step">
//       <h3>Upload Event Banner</h3>

//       {preview && <img src={preview} alt="Preview" className="banner-preview" />}

//       <input type="file" accept="image/*" onChange={handleFileChange} />

//       <div className="button-group">
//         <button onClick={onBack}>Back</button>
//         <button onClick={handleUpload} disabled={uploading}>
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
        setImageUrl(urlData.publicUrl); // this triggers state update in parent
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
    <div className="create-banner-step">
      <h3>Upload Event Banner</h3>

      {preview && (
        <img src={preview} alt="Banner Preview" className="banner-preview" />
      )}

      <input type="file" accept=".jpg" onChange={handleFileChange} />

      <div className="button-group">
        <button onClick={onBack} disabled={uploading}>
          Back
        </button>
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default CreateBanner;
