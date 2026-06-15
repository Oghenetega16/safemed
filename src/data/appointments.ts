import type { AppointmentRecord } from "@/types";

export const appointmentRecords: AppointmentRecord[] = [
  { id: "AP-2001", patientName: "Jordan Rivers", avatarColor: "#3EA8FF", doctor: "Dr. Amelia Cruz", department: "Neurology", type: "Follow-up", date: "2025-02-17", time: "08:00 AM", duration: "30 min", status: "completed" },
  { id: "AP-2002", patientName: "Taylor Green", avatarColor: "#FF6B81", doctor: "Dr. Marcus Lee", department: "Cardiology", type: "Emergency Visit", date: "2025-02-17", time: "09:15 AM", duration: "45 min", status: "completed" },
  { id: "AP-2003", patientName: "Casey Blue", avatarColor: "#1FCB8F", doctor: "Dr. Priya Nair", department: "General Medicine", type: "Post-Op Review", date: "2025-02-18", time: "10:00 AM", duration: "20 min", status: "confirmed" },
  { id: "AP-2004", patientName: "Morgan Sky", avatarColor: "#3EA8FF", doctor: "Dr. Daniel Osei", department: "General Medicine", type: "Consultation", date: "2025-02-18", time: "01:30 PM", duration: "30 min", status: "confirmed" },
  { id: "AP-2005", patientName: "Avery Stone", avatarColor: "#8C6CFF", doctor: "Dr. Amelia Cruz", department: "Endocrinology", type: "Routine Checkup", date: "2025-02-18", time: "02:45 PM", duration: "30 min", status: "pending" },
  { id: "AP-2006", patientName: "Riley Brooks", avatarColor: "#FFB648", doctor: "Dr. Sofia Martinez", department: "Pediatrics", type: "Follow-up", date: "2025-02-18", time: "03:30 PM", duration: "20 min", status: "confirmed" },
  { id: "AP-2007", patientName: "Jamie Cole", avatarColor: "#FF6B81", doctor: "Dr. Marcus Lee", department: "Pulmonology", type: "Consultation", date: "2025-02-19", time: "08:30 AM", duration: "45 min", status: "confirmed" },
  { id: "AP-2008", patientName: "Drew Hayes", avatarColor: "#3EE0D1", doctor: "Dr. Priya Nair", department: "Orthopedics", type: "Physical Therapy", date: "2025-02-19", time: "09:45 AM", duration: "60 min", status: "confirmed" },
  { id: "AP-2009", patientName: "Sam Parker", avatarColor: "#3E6BFF", doctor: "Dr. Daniel Osei", department: "Nephrology", type: "Dialysis Session", date: "2025-02-19", time: "11:00 AM", duration: "180 min", status: "confirmed" },
  { id: "AP-2010", patientName: "Quinn Foster", avatarColor: "#1FCB8F", doctor: "Dr. Marcus Lee", department: "Critical Care", type: "ICU Review", date: "2025-02-19", time: "07:00 AM", duration: "30 min", status: "confirmed" },
  { id: "AP-2011", patientName: "Reese Carter", avatarColor: "#FFB648", doctor: "Dr. Sofia Martinez", department: "Pulmonology", type: "Lab Test", date: "2025-02-19", time: "01:00 PM", duration: "15 min", status: "pending" },
  { id: "AP-2012", patientName: "Harper Lane", avatarColor: "#FF9F6B", doctor: "Dr. Amelia Cruz", department: "Urology", type: "Follow-up", date: "2025-02-19", time: "02:15 PM", duration: "20 min", status: "confirmed" },
  { id: "AP-2013", patientName: "Skyler Reed", avatarColor: "#3EA8FF", doctor: "Dr. Daniel Osei", department: "General Medicine", type: "Discharge Review", date: "2025-02-15", time: "11:30 AM", duration: "20 min", status: "completed" },
  { id: "AP-2014", patientName: "Emerson Vale", avatarColor: "#8C6CFF", doctor: "Dr. Ethan Wallace", department: "Cardiology", type: "Medication Review", date: "2025-02-19", time: "04:00 PM", duration: "30 min", status: "confirmed" },
  { id: "AP-2015", patientName: "Logan Pierce", avatarColor: "#1FCB8F", doctor: "Dr. Ethan Wallace", department: "Hematology", type: "Iron Infusion", date: "2025-02-19", time: "10:30 AM", duration: "90 min", status: "confirmed" },
  { id: "AP-2016", patientName: "Jordan Rivers", avatarColor: "#3EA8FF", doctor: "Dr. Amelia Cruz", department: "Neurology", type: "Follow-up", date: "2025-02-21", time: "09:00 AM", duration: "30 min", status: "pending" },
  { id: "AP-2017", patientName: "Nina Alvarez", avatarColor: "#FF9F6B", doctor: "Dr. Sofia Martinez", department: "Dermatology", type: "Consultation", date: "2025-02-20", time: "10:15 AM", duration: "30 min", status: "confirmed" },
  { id: "AP-2018", patientName: "Owen Brennan", avatarColor: "#3EE0D1", doctor: "Dr. Priya Nair", department: "ENT", type: "Routine Checkup", date: "2025-02-20", time: "11:45 AM", duration: "20 min", status: "cancelled" },
  { id: "AP-2019", patientName: "Maya Thompson", avatarColor: "#8C6CFF", doctor: "Dr. Daniel Osei", department: "General Medicine", type: "Vaccination", date: "2025-02-20", time: "03:00 PM", duration: "15 min", status: "confirmed" },
  { id: "AP-2020", patientName: "Theo Bennett", avatarColor: "#FFB648", doctor: "Dr. Marcus Lee", department: "Cardiology", type: "Stress Test", date: "2025-02-21", time: "01:45 PM", duration: "60 min", status: "pending" },
];

export const doctorOptions = [
  "Dr. Amelia Cruz",
  "Dr. Marcus Lee",
  "Dr. Priya Nair",
  "Dr. Daniel Osei",
  "Dr. Sofia Martinez",
  "Dr. Ethan Wallace",
];

export const departmentOptions = [
  "General Medicine",
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
  "ENT",
  "Pulmonology",
  "Nephrology",
  "Endocrinology",
  "Urology",
  "Hematology",
  "Critical Care",
];

export const appointmentTypeOptions = [
  "Consultation",
  "Follow-up",
  "Routine Checkup",
  "Physical Therapy",
  "Lab Test",
  "Vaccination",
  "Emergency Visit",
  "Medication Review",
];
