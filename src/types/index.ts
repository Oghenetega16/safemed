export type StatTrend = "up" | "down" | "neutral";

export interface StatCardData {
  id: string;
  label: string;
  sublabel: string;
  value: string;
  trendLabel: string;
  trend: StatTrend;
  icon: string;
  accent: "rose" | "amber" | "violet" | "sky" | "mint";
}

export interface RiskSegment {
  id: string;
  label: string;
  value: number;
  count: number;
  color: string;
}

export interface PatientStat {
  id: string;
  label: string;
  percentage: number;
  color: string;
  trend: string;
}

export interface Appointment {
  id: string;
  time: string;
  patientName: string;
  reason: string;
  avatarColor: string;
  status: "confirmed" | "pending" | "urgent";
}

export interface AppointmentOverviewStat {
  id: string;
  label: string;
  value: number;
}

export interface DateLegendItem {
  id: string;
  label: string;
  color: string;
}

export interface CalendarDayMeta {
  date: number;
  dots?: string[];
  isCurrentMonth: boolean;
  isToday?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Patients                                                                     */
/* -------------------------------------------------------------------------- */

export type PatientStatus = "Stable" | "Critical" | "Recovering" | "Discharged";
export type RiskLevel = "Low" | "Moderate" | "High";

export interface VitalsReading {
  label: string;
  value: string;
  status: "normal" | "warning" | "critical";
}

export interface PatientTimelineEntry {
  date: string;
  title: string;
  description: string;
}

export interface VitalsTrendPoint {
  day: string;
  heartRate: number;
  spo2: number;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  avatarColor: string;
  condition: string;
  status: PatientStatus;
  riskLevel: RiskLevel;
  ward: string;
  doctor: string;
  phone: string;
  email: string;
  bloodType: string;
  admissionDate: string;
  lastVisit: string;
  vitals: VitalsReading[];
  history: PatientTimelineEntry[];
  vitalsTrend: VitalsTrendPoint[];
}

/* -------------------------------------------------------------------------- */
/* AI Clinical Decision Support                                                 */
/* -------------------------------------------------------------------------- */

export type AlertSeverity = "critical" | "high" | "moderate" | "low";
export type AlertStatus = "new" | "acknowledged" | "resolved";

export interface ClinicalAlert {
  id: string;
  patientName: string;
  patientId: string;
  severity: AlertSeverity;
  category: string;
  title: string;
  description: string;
  recommendation: string;
  confidence: number;
  timestamp: string;
  status: AlertStatus;
}

export interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

/* -------------------------------------------------------------------------- */
/* Appointments                                                                 */
/* -------------------------------------------------------------------------- */

export type AppointmentStatus = "confirmed" | "pending" | "cancelled" | "completed";

export interface AppointmentRecord {
  id: string;
  patientName: string;
  avatarColor: string;
  doctor: string;
  department: string;
  type: string;
  date: string;
  time: string;
  duration: string;
  status: AppointmentStatus;
}

/* -------------------------------------------------------------------------- */
/* Clinical Operations                                                          */
/* -------------------------------------------------------------------------- */

export interface WardInfo {
  id: string;
  name: string;
  type: string;
  floor: string;
  capacity: number;
  occupied: number;
}

export type StaffStatus = "On Duty" | "On Break" | "Off Duty";

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  shift: string;
  status: StaffStatus;
  avatarColor: string;
}

export type OperationStatus = "Scheduled" | "In Progress" | "Completed" | "Delayed";

export interface OperationSchedule {
  id: string;
  procedure: string;
  patientName: string;
  surgeon: string;
  room: string;
  time: string;
  status: OperationStatus;
}

/* -------------------------------------------------------------------------- */
/* Billing & Revenue                                                            */
/* -------------------------------------------------------------------------- */

export type InvoiceStatus = "Paid" | "Pending" | "Overdue";

export interface Invoice {
  id: string;
  invoiceNo: string;
  patientName: string;
  avatarColor: string;
  date: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
  method: string;
  service: string;
}

export interface RevenuePoint {
  month: string;
  revenue: number;
  expenses: number;
}

/* -------------------------------------------------------------------------- */
/* MR & Docs                                                                     */
/* -------------------------------------------------------------------------- */

export type DocumentType =
  | "Lab Report"
  | "Prescription"
  | "Imaging"
  | "Discharge Summary"
  | "Insurance"
  | "Consent Form";

export type FileKind = "pdf" | "image" | "doc";

export interface MedicalDocument {
  id: string;
  name: string;
  patientName: string;
  type: DocumentType;
  date: string;
  size: string;
  fileKind: FileKind;
  doctor: string;
}

/* -------------------------------------------------------------------------- */
/* Inventory & Supplies                                                         */
/* -------------------------------------------------------------------------- */

export type InventoryStatus = "In Stock" | "Low Stock" | "Out of Stock";

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  reorderLevel: number;
  unit: string;
  supplier: string;
  lastRestocked: string;
}

/* -------------------------------------------------------------------------- */
/* Reports & Analytics                                                          */
/* -------------------------------------------------------------------------- */

export interface ChartPoint {
  label: string;
  value: number;
}

export interface AdmissionsPoint {
  month: string;
  inpatient: number;
  outpatient: number;
}

export interface DepartmentPerformance {
  department: string;
  patients: number;
  satisfaction: number;
}

/* -------------------------------------------------------------------------- */
/* Communications                                                               */
/* -------------------------------------------------------------------------- */

export interface ChatMessage {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  online: boolean;
  messages: ChatMessage[];
}
