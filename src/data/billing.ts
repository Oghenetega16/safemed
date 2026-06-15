import type { Invoice, RevenuePoint } from "@/types";

export const invoices: Invoice[] = [
  { id: "INV-3001", invoiceNo: "INV-2025-0301", patientName: "Jordan Rivers", avatarColor: "#3EA8FF", date: "2025-02-18", dueDate: "2025-03-04", amount: 180, status: "Paid", method: "Credit Card", service: "Neurology Consultation" },
  { id: "INV-3002", invoiceNo: "INV-2025-0302", patientName: "Taylor Green", avatarColor: "#FF6B81", date: "2025-02-19", dueDate: "2025-03-05", amount: 4200, status: "Pending", method: "Insurance", service: "ICU Admission & Monitoring" },
  { id: "INV-3003", invoiceNo: "INV-2025-0303", patientName: "Casey Blue", avatarColor: "#1FCB8F", date: "2025-02-15", dueDate: "2025-03-01", amount: 2850, status: "Paid", method: "Insurance", service: "Appendectomy Surgery" },
  { id: "INV-3004", invoiceNo: "INV-2025-0304", patientName: "Morgan Sky", avatarColor: "#3EA8FF", date: "2025-02-19", dueDate: "2025-03-05", amount: 120, status: "Pending", method: "Cash", service: "General Consultation" },
  { id: "INV-3005", invoiceNo: "INV-2025-0305", patientName: "Avery Stone", avatarColor: "#8C6CFF", date: "2025-02-10", dueDate: "2025-02-24", amount: 340, status: "Overdue", method: "Insurance", service: "Diabetes Management Plan" },
  { id: "INV-3006", invoiceNo: "INV-2025-0306", patientName: "Riley Brooks", avatarColor: "#FFB648", date: "2025-02-17", dueDate: "2025-03-03", amount: 260, status: "Paid", method: "Insurance", service: "Pediatric Asthma Treatment" },
  { id: "INV-3007", invoiceNo: "INV-2025-0307", patientName: "Jamie Cole", avatarColor: "#FF6B81", date: "2025-02-13", dueDate: "2025-02-27", amount: 3650, status: "Pending", method: "Insurance", service: "Pneumonia Treatment & ICU" },
  { id: "INV-3008", invoiceNo: "INV-2025-0308", patientName: "Drew Hayes", avatarColor: "#3EE0D1", date: "2025-02-11", dueDate: "2025-02-25", amount: 5400, status: "Paid", method: "Insurance", service: "Tibia Fracture Surgery" },
  { id: "INV-3009", invoiceNo: "INV-2025-0309", patientName: "Sam Parker", avatarColor: "#3E6BFF", date: "2025-02-09", dueDate: "2025-02-23", amount: 980, status: "Overdue", method: "Insurance", service: "Dialysis Sessions (Weekly)" },
  { id: "INV-3010", invoiceNo: "INV-2025-0310", patientName: "Quinn Foster", avatarColor: "#1FCB8F", date: "2025-02-18", dueDate: "2025-03-04", amount: 5200, status: "Pending", method: "Insurance", service: "Sepsis Treatment & ICU" },
  { id: "INV-3011", invoiceNo: "INV-2025-0311", patientName: "Reese Carter", avatarColor: "#FFB648", date: "2025-02-08", dueDate: "2025-02-22", amount: 410, status: "Paid", method: "Cash", service: "COPD Management" },
  { id: "INV-3012", invoiceNo: "INV-2025-0312", patientName: "Harper Lane", avatarColor: "#FF9F6B", date: "2025-02-16", dueDate: "2025-03-02", amount: 145, status: "Paid", method: "Credit Card", service: "UTI Treatment" },
  { id: "INV-3013", invoiceNo: "INV-2025-0313", patientName: "Skyler Reed", avatarColor: "#3EA8FF", date: "2025-02-12", dueDate: "2025-02-26", amount: 95, status: "Paid", method: "Cash", service: "General Consultation" },
  { id: "INV-3014", invoiceNo: "INV-2025-0314", patientName: "Emerson Vale", avatarColor: "#8C6CFF", date: "2025-02-14", dueDate: "2025-02-28", amount: 220, status: "Overdue", method: "Insurance", service: "Hypertension Follow-up" },
  { id: "INV-3015", invoiceNo: "INV-2025-0315", patientName: "Logan Pierce", avatarColor: "#1FCB8F", date: "2025-02-15", dueDate: "2025-03-01", amount: 760, status: "Paid", method: "Insurance", service: "Iron Infusion Therapy" },
  { id: "INV-3016", invoiceNo: "INV-2025-0316", patientName: "Nina Alvarez", avatarColor: "#FF9F6B", date: "2025-02-20", dueDate: "2025-03-06", amount: 130, status: "Pending", method: "Credit Card", service: "Dermatology Consultation" },
  { id: "INV-3017", invoiceNo: "INV-2025-0317", patientName: "Owen Brennan", avatarColor: "#3EE0D1", date: "2025-02-09", dueDate: "2025-02-23", amount: 165, status: "Paid", method: "Cash", service: "ENT Checkup" },
  { id: "INV-3018", invoiceNo: "INV-2025-0318", patientName: "Maya Thompson", avatarColor: "#8C6CFF", date: "2025-02-20", dueDate: "2025-03-06", amount: 60, status: "Paid", method: "Cash", service: "Vaccination" },
];

export const revenueTrend: RevenuePoint[] = [
  { month: "Mar", revenue: 142000, expenses: 98000 },
  { month: "Apr", revenue: 151000, expenses: 101000 },
  { month: "May", revenue: 148500, expenses: 99500 },
  { month: "Jun", revenue: 162000, expenses: 104000 },
  { month: "Jul", revenue: 171000, expenses: 108500 },
  { month: "Aug", revenue: 168000, expenses: 110000 },
  { month: "Sep", revenue: 175500, expenses: 112000 },
  { month: "Oct", revenue: 182000, expenses: 115500 },
  { month: "Nov", revenue: 179000, expenses: 117000 },
  { month: "Dec", revenue: 196000, expenses: 121000 },
  { month: "Jan", revenue: 188500, expenses: 119500 },
  { month: "Feb", revenue: 203000, expenses: 124000 },
];

export const paymentMethods = ["Cash", "Credit Card", "Insurance", "Bank Transfer"];

export const billingServices = [
  "General Consultation",
  "Specialist Consultation",
  "Lab Tests",
  "Imaging / X-Ray",
  "Physical Therapy Session",
  "Surgical Procedure",
  "Vaccination",
  "Emergency Visit",
];
