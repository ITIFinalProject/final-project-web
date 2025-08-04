import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { uploadReportImage } from "./reportImageService";

export const reportService = {
  // Create a new report
  createReport: async (reportData, evidenceImage = null) => {
    try {
      let evidenceImageUrl = null;

      // Upload evidence image if provided
      if (evidenceImage) {
        // Generate a temporary report ID for the image filename
        const tempReportId = `${reportData.eventId}-${Date.now()}`;
        const uploadResult = await uploadReportImage(
          evidenceImage,
          tempReportId
        );

        if (uploadResult.error) {
          throw new Error(`Image upload failed: ${uploadResult.error}`);
        }

        evidenceImageUrl = uploadResult.url;
      }

      // Create the report document
      const reportRef = await addDoc(collection(db, "reports"), {
        eventId: reportData.eventId,
        eventTitle: reportData.eventTitle,
        eventHostId: reportData.eventHostId,
        eventHostName: reportData.eventHostName,
        reporterId: reportData.reporterId,
        reporterName: reportData.reporterName,
        reason: reportData.reason,
        customReason: reportData.customReason || null,
        description: reportData.description || null,
        evidenceImageUrl: evidenceImageUrl,
        status: "pending", // pending, reviewed, resolved
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return { id: reportRef.id, ...reportData };
    } catch (error) {
      console.error("Error creating report:", error);
      throw new Error("Failed to submit report. Please try again.");
    }
  },

  // Get all reports for an event (admin/moderator use)
  getEventReports: async (eventId) => {
    try {
      const q = query(
        collection(db, "reports"),
        where("eventId", "==", eventId)
      );
      const querySnapshot = await getDocs(q);

      const reports = [];
      querySnapshot.forEach((doc) => {
        reports.push({ id: doc.id, ...doc.data() });
      });

      return reports;
    } catch (error) {
      console.error("Error fetching event reports:", error);
      throw error;
    }
  },

  // Get all reports by a user
  getUserReports: async (userId) => {
    try {
      const q = query(
        collection(db, "reports"),
        where("reporterId", "==", userId)
      );
      const querySnapshot = await getDocs(q);

      const reports = [];
      querySnapshot.forEach((doc) => {
        reports.push({ id: doc.id, ...doc.data() });
      });

      return reports;
    } catch (error) {
      console.error("Error fetching user reports:", error);
      throw error;
    }
  },
};

// Predefined report reasons
export const REPORT_REASONS = [
  {
    id: "inappropriate_content",
    label: "Inappropriate Content",
    description: "Event contains offensive or inappropriate material",
  },
  {
    id: "misleading_info",
    label: "Misleading Information",
    description: "Event details are false or misleading",
  },
  {
    id: "spam",
    label: "Spam",
    description: "Event appears to be spam or promotional content",
  },
  {
    id: "scam_fraud",
    label: "Scam/Fraud",
    description: "Event appears to be fraudulent or a scam",
  },
  {
    id: "harassment",
    label: "Harassment",
    description: "Event promotes harassment or discrimination",
  },
  {
    id: "violence",
    label: "Violence/Threats",
    description: "Event contains violent content or threats",
  },
  {
    id: "copyright",
    label: "Copyright Violation",
    description: "Event uses copyrighted material without permission",
  },
  {
    id: "other",
    label: "Other",
    description: "Other reason not listed above",
  },
];
