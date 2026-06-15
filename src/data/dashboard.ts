import type {
  StatCardData,
  RiskSegment,
  PatientStat,
  Appointment,
  AppointmentOverviewStat,
  DateLegendItem,
  CalendarDayMeta,
} from "@/types";

export const statCards: StatCardData[] = [
  {
    id: "appointments",
    label: "Appointments",
    sublabel: "Today",
    value: "98",
    trendLabel: "Annual Change 60%",
    trend: "up",
    icon: "calendar-check",
    accent: "rose",
  },
  {
    id: "patients",
    label: "Total Patients",
    sublabel: "Today",
    value: "87",
    trendLabel: "New 29  |  Old Patients 8",
    trend: "neutral",
    icon: "users",
    accent: "amber",
  },
  {
    id: "rooms",
    label: "Overall Rooms",
    sublabel: "All Time",
    value: "112",
    trendLabel: "General Room 82  |  Private Room 30",
    trend: "neutral",
    icon: "bed",
    accent: "violet",
  },
  {
    id: "doctors",
    label: "Doctors on Duty",
    sublabel: "Today",
    value: "76",
    trendLabel: "Available Doctors 72  |  On Leave 04",
    trend: "neutral",
    icon: "stethoscope",
    accent: "sky",
  },
  {
    id: "treatments",
    label: "Treatments",
    sublabel: "Upcoming",
    value: "64",
    trendLabel: "Operations 30  |  General 34",
    trend: "neutral",
    icon: "heart-pulse",
    accent: "mint",
  },
];

export const riskSegments: RiskSegment[] = [
  { id: "high", label: "High Risk", value: 12, count: 12, color: "#FF6B81" },
  { id: "moderate", label: "Moderate Risk", value: 25, count: 25, color: "#FFB648" },
  { id: "low", label: "Low Risk", value: 78, count: 78, color: "#1FCB8F" },
];

export const aiInsights: string[] = [
  "Sepsis Risk Detected in 3 Patients",
  "Chronic Disease Alert for 7 Patients",
  "Model Confidence: 92%",
];

export const patientStats: PatientStat[] = [
  { id: "emergency", label: "Emergency patient", percentage: 56, color: "#FF6B81", trend: "+5%" },
  { id: "checkup", label: "Routine Check-up", percentage: 45, color: "#8C6CFF", trend: "+6%" },
  { id: "appointment", label: "Appointment", percentage: 34, color: "#1FCB8F", trend: "+7%" },
  { id: "physical", label: "Physical therapy", percentage: 20, color: "#FFB648", trend: "+9%" },
  { id: "therapy", label: "Therapy session", percentage: 16, color: "#3EA8FF", trend: "+3%" },
];

export const appointmentOverviewStats: AppointmentOverviewStat[] = [
  { id: "scheduled", label: "Total Scheduled", value: 1025 },
  { id: "completed", label: "Completed", value: 780 },
  { id: "missed", label: "Missed", value: 245 },
  { id: "cancelled", label: "Cancelled", value: 17 },
];

export const appointments: Appointment[] = [
  {
    id: "1",
    time: "7:28 AM",
    patientName: "Jordan Rivers",
    reason: "Migraine",
    avatarColor: "#3EA8FF",
    status: "confirmed",
  },
  {
    id: "2",
    time: "1:12 PM",
    patientName: "Taylor Green",
    reason: "Throbbing Pain",
    avatarColor: "#FF6B81",
    status: "urgent",
  },
  {
    id: "3",
    time: "6:11 PM",
    patientName: "Casey Blue",
    reason: "Pounding Sensation",
    avatarColor: "#1FCB8F",
    status: "confirmed",
  },
  {
    id: "4",
    time: "2:31 PM",
    patientName: "Morgan Sky",
    reason: "Tension Ache",
    avatarColor: "#3EA8FF",
    status: "pending",
  },
];

export const dateLegends: DateLegendItem[] = [
  { id: "emergency", label: "Emergency Patient Meet", color: "#FF6B81" },
  { id: "physical", label: "Physical Appointment", color: "#3EA8FF" },
  { id: "checkup", label: "Normal Health Checkups", color: "#1FCB8F" },
  { id: "vaccination", label: "Routine Vaccination", color: "#8C6CFF" },
  { id: "dental", label: "Dental Cleaning", color: "#FFB648" },
  { id: "lab", label: "Lab Test Follow-Up", color: "#FF9F6B" },
  { id: "blood", label: "Blood Pressure Monitoring", color: "#3EE0D1" },
];

// February 2025 calendar grid (Mon - Sun), matching reference design
export const calendarDays: CalendarDayMeta[] = [
  { date: 27, isCurrentMonth: false },
  { date: 28, isCurrentMonth: false },
  { date: 29, isCurrentMonth: false },
  { date: 30, isCurrentMonth: false },
  { date: 31, isCurrentMonth: false },
  { date: 1, isCurrentMonth: true },
  { date: 2, isCurrentMonth: true },
  { date: 3, isCurrentMonth: true, dots: ["#FF6B81"] },
  { date: 4, isCurrentMonth: true },
  { date: 5, isCurrentMonth: true },
  { date: 6, isCurrentMonth: true },
  { date: 7, isCurrentMonth: true },
  { date: 8, isCurrentMonth: true },
  { date: 9, isCurrentMonth: true },
  { date: 10, isCurrentMonth: true },
  { date: 11, isCurrentMonth: true },
  { date: 12, isCurrentMonth: true },
  { date: 13, isCurrentMonth: true },
  { date: 14, isCurrentMonth: true },
  { date: 15, isCurrentMonth: true },
  { date: 16, isCurrentMonth: true },
  { date: 17, isCurrentMonth: true },
  { date: 18, isCurrentMonth: true, isToday: true, dots: ["#1FCB8F", "#3EA8FF"] },
  { date: 19, isCurrentMonth: true },
  { date: 20, isCurrentMonth: true },
  { date: 21, isCurrentMonth: true },
  { date: 22, isCurrentMonth: true },
  { date: 23, isCurrentMonth: true },
  { date: 24, isCurrentMonth: true },
  { date: 25, isCurrentMonth: true },
  { date: 26, isCurrentMonth: true },
  { date: 27, isCurrentMonth: true },
  { date: 28, isCurrentMonth: true },
];
