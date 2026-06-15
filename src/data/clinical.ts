import type { WardInfo, StaffMember, OperationSchedule } from "@/types";

export const wards: WardInfo[] = [
  { id: "WD-01", name: "General Ward A", type: "General Medicine", floor: "Floor 2", capacity: 40, occupied: 32 },
  { id: "WD-02", name: "General Ward B", type: "General Medicine", floor: "Floor 2", capacity: 36, occupied: 28 },
  { id: "WD-03", name: "Intensive Care Unit", type: "Critical Care", floor: "Floor 4", capacity: 16, occupied: 13 },
  { id: "WD-04", name: "Private Suites", type: "Private Care", floor: "Floor 5", capacity: 20, occupied: 11 },
  { id: "WD-05", name: "Pediatric Ward", type: "Pediatrics", floor: "Floor 3", capacity: 24, occupied: 15 },
  { id: "WD-06", name: "Surgical Recovery", type: "Post-Operative", floor: "Floor 3", capacity: 18, occupied: 9 },
];

export const staffMembers: StaffMember[] = [
  { id: "ST-01", name: "Dr. Amelia Cruz", role: "Physician", department: "General Medicine", shift: "7:00 AM – 3:00 PM", status: "On Duty", avatarColor: "#3E6BFF" },
  { id: "ST-02", name: "Dr. Marcus Lee", role: "Cardiologist", department: "Cardiology", shift: "7:00 AM – 7:00 PM", status: "On Duty", avatarColor: "#FF6B81" },
  { id: "ST-03", name: "Dr. Priya Nair", role: "Surgeon", department: "Orthopedics", shift: "6:00 AM – 2:00 PM", status: "On Break", avatarColor: "#1FCB8F" },
  { id: "ST-04", name: "Wendy Tran", role: "Registered Nurse", department: "Critical Care", shift: "7:00 AM – 7:00 PM", status: "On Duty", avatarColor: "#FFB648" },
  { id: "ST-05", name: "Carlos Vega", role: "Registered Nurse", department: "General Medicine", shift: "7:00 AM – 3:00 PM", status: "On Duty", avatarColor: "#3EA8FF" },
  { id: "ST-06", name: "Dr. Daniel Osei", role: "Nephrologist", department: "Nephrology", shift: "8:00 AM – 4:00 PM", status: "On Duty", avatarColor: "#8C6CFF" },
  { id: "ST-07", name: "Dr. Sofia Martinez", role: "Pediatrician", department: "Pediatrics", shift: "8:00 AM – 4:00 PM", status: "On Break", avatarColor: "#FF9F6B" },
  { id: "ST-08", name: "Lina Park", role: "Registered Nurse", department: "Pediatrics", shift: "3:00 PM – 11:00 PM", status: "Off Duty", avatarColor: "#3EE0D1" },
  { id: "ST-09", name: "Dr. Ethan Wallace", role: "Hematologist", department: "Hematology", shift: "9:00 AM – 5:00 PM", status: "On Duty", avatarColor: "#1FCB8F" },
  { id: "ST-10", name: "Mark Ibe", role: "Anesthesiologist", department: "Surgical", shift: "6:00 AM – 2:00 PM", status: "On Duty", avatarColor: "#3E6BFF" },
  { id: "ST-11", name: "Olivia Kim", role: "Lab Technician", department: "Pathology", shift: "7:00 AM – 3:00 PM", status: "On Duty", avatarColor: "#FFB648" },
  { id: "ST-12", name: "Noah Fields", role: "Pharmacist", department: "Pharmacy", shift: "9:00 AM – 5:00 PM", status: "Off Duty", avatarColor: "#FF6B81" },
];

export const operationSchedule: OperationSchedule[] = [
  { id: "OT-01", procedure: "Appendectomy", patientName: "Casey Blue", surgeon: "Dr. Priya Nair", room: "OR 1", time: "08:00 AM", status: "Completed" },
  { id: "OT-02", procedure: "Tibia Fracture Fixation", patientName: "Drew Hayes", surgeon: "Dr. Priya Nair", room: "OR 2", time: "10:30 AM", status: "In Progress" },
  { id: "OT-03", procedure: "Cardiac Catheterization", patientName: "Taylor Green", surgeon: "Dr. Marcus Lee", room: "OR 3", time: "01:00 PM", status: "Scheduled" },
  { id: "OT-04", procedure: "Knee Arthroscopy", patientName: "Theo Bennett", surgeon: "Dr. Priya Nair", room: "OR 1", time: "02:30 PM", status: "Scheduled" },
  { id: "OT-05", procedure: "Hernia Repair", patientName: "Owen Brennan", surgeon: "Dr. Ethan Wallace", room: "OR 2", time: "04:00 PM", status: "Delayed" },
];
