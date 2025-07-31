import { supabase } from "../supabase/config";

/**
 * Upload event banner image to Supabase storage
 * @param {File} file - The image file to upload
 * @param {string} eventId - The event's ID to create a unique filename
 * @returns {Promise<{url: string, error: null} | {url: null, error: string}>}
 */
export const uploadEventImage = async (file, eventId) => {
  try {
    // Validate file
    if (!file) {
      throw new Error("No file provided");
    }

    // Check file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      throw new Error(
        "Invalid file type. Please upload a JPEG, PNG, or WebP image."
      );
    }

    // Check file size (10MB limit for event banners)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error(
        "File too large. Please upload an image smaller than 10MB."
      );
    }

    // Create unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `event-${eventId}-${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    // Upload file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from("event-images")
      .upload(filePath, file, {
        upsert: true, // Replace file if it exists
        contentType: file.type,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("event-images")
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      throw new Error("Failed to get public URL");
    }

    return {
      url: urlData.publicUrl,
      error: null,
    };
  } catch (error) {
    console.error("Error uploading event image:", error);
    return {
      url: null,
      error: error.message,
    };
  }
};

/**
 * Delete event image from Supabase storage
 * @param {string} imageUrl - The full URL of the image to delete
 * @returns {Promise<{success: boolean, error: string | null}>}
 */
export const deleteEventImage = async (imageUrl) => {
  try {
    if (!imageUrl) {
      return { success: true, error: null };
    }

    // Extract file path from URL
    const urlParts = imageUrl.split("/");
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `public/${fileName}`;

    // Delete file from Supabase storage
    const { error } = await supabase.storage
      .from("event-images")
      .remove([filePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Error deleting event image:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export default {
  uploadEventImage,
  deleteEventImage,
};
