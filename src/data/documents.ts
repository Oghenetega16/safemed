import type { MedicalDocument } from "@/types";

export const medicalDocuments: MedicalDocument[] = [
  { id: "DOC-4001", name: "CBC Panel Results", patientName: "Jordan Rivers", type: "Lab Report", date: "2025-02-18", size: "1.2 MB", fileKind: "pdf", doctor: "Dr. Amelia Cruz" },
  { id: "DOC-4002", name: "ECG Strip & Report", patientName: "Taylor Green", type: "Lab Report", date: "2025-02-19", size: "3.4 MB", fileKind: "image", doctor: "Dr. Marcus Lee" },
  { id: "DOC-4003", name: "Sumatriptan Prescription", patientName: "Jordan Rivers", type: "Prescription", date: "2025-02-18", size: "184 KB", fileKind: "pdf", doctor: "Dr. Amelia Cruz" },
  { id: "DOC-4004", name: "Abdominal CT Scan", patientName: "Casey Blue", type: "Imaging", date: "2025-02-14", size: "8.1 MB", fileKind: "image", doctor: "Dr. Priya Nair" },
  { id: "DOC-4005", name: "Post-Op Discharge Summary", patientName: "Casey Blue", type: "Discharge Summary", date: "2025-02-19", size: "412 KB", fileKind: "doc", doctor: "Dr. Priya Nair" },
  { id: "DOC-4006", name: "Chest X-Ray", patientName: "Jamie Cole", type: "Imaging", date: "2025-02-19", size: "5.6 MB", fileKind: "image", doctor: "Dr. Marcus Lee" },
  { id: "DOC-4007", name: "Antibiotic Course Prescription", patientName: "Jamie Cole", type: "Prescription", date: "2025-02-13", size: "201 KB", fileKind: "pdf", doctor: "Dr. Marcus Lee" },
  { id: "DOC-4008", name: "Insurance Pre-Authorization", patientName: "Sam Parker", type: "Insurance", date: "2025-02-09", size: "560 KB", fileKind: "pdf", doctor: "Dr. Daniel Osei" },
  { id: "DOC-4009", name: "Tibia X-Ray (Post-Surgery)", patientName: "Drew Hayes", type: "Imaging", date: "2025-02-12", size: "4.9 MB", fileKind: "image", doctor: "Dr. Priya Nair" },
  { id: "DOC-4010", name: "Surgical Consent Form", patientName: "Drew Hayes", type: "Consent Form", date: "2025-02-11", size: "98 KB", fileKind: "doc", doctor: "Dr. Priya Nair" },
  { id: "DOC-4011", name: "Hemoglobin Trend Report", patientName: "Logan Pierce", type: "Lab Report", date: "2025-02-19", size: "320 KB", fileKind: "pdf", doctor: "Dr. Ethan Wallace" },
  { id: "DOC-4012", name: "Iron Infusion Consent", patientName: "Logan Pierce", type: "Consent Form", date: "2025-02-15", size: "88 KB", fileKind: "doc", doctor: "Dr. Ethan Wallace" },
  { id: "DOC-4013", name: "Pulmonary Function Test", patientName: "Reese Carter", type: "Lab Report", date: "2025-02-17", size: "740 KB", fileKind: "pdf", doctor: "Dr. Sofia Martinez" },
  { id: "DOC-4014", name: "Discharge Summary", patientName: "Skyler Reed", type: "Discharge Summary", date: "2025-02-15", size: "356 KB", fileKind: "doc", doctor: "Dr. Daniel Osei" },
  { id: "DOC-4015", name: "Lisinopril Prescription", patientName: "Emerson Vale", type: "Prescription", date: "2025-02-19", size: "176 KB", fileKind: "pdf", doctor: "Dr. Ethan Wallace" },
  { id: "DOC-4016", name: "Asthma Action Plan", patientName: "Riley Brooks", type: "Discharge Summary", date: "2025-02-19", size: "248 KB", fileKind: "doc", doctor: "Dr. Sofia Martinez" },
];

export const documentTypes = ["Lab Report", "Prescription", "Imaging", "Discharge Summary", "Insurance", "Consent Form"] as const;
