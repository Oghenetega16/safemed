import type { AdmissionsPoint, DepartmentPerformance, ChartPoint } from "@/types";

export const admissionsTrend: AdmissionsPoint[] = [
  { month: "Mar", inpatient: 210, outpatient: 540 },
  { month: "Apr", inpatient: 224, outpatient: 562 },
  { month: "May", inpatient: 218, outpatient: 588 },
  { month: "Jun", inpatient: 235, outpatient: 601 },
  { month: "Jul", inpatient: 248, outpatient: 615 },
  { month: "Aug", inpatient: 242, outpatient: 630 },
  { month: "Sep", inpatient: 255, outpatient: 648 },
  { month: "Oct", inpatient: 268, outpatient: 660 },
  { month: "Nov", inpatient: 261, outpatient: 645 },
  { month: "Dec", inpatient: 280, outpatient: 672 },
  { month: "Jan", inpatient: 274, outpatient: 658 },
  { month: "Feb", inpatient: 289, outpatient: 690 },
];

export const departmentPerformance: DepartmentPerformance[] = [
  { department: "General Medicine", patients: 420, satisfaction: 91 },
  { department: "Cardiology", patients: 268, satisfaction: 88 },
  { department: "Pediatrics", patients: 312, satisfaction: 95 },
  { department: "Orthopedics", patients: 198, satisfaction: 86 },
  { department: "Neurology", patients: 156, satisfaction: 89 },
  { department: "Critical Care", patients: 94, satisfaction: 92 },
  { department: "Nephrology", patients: 87, satisfaction: 84 },
  { department: "Pulmonology", patients: 121, satisfaction: 90 },
];

export const ageDemographics: ChartPoint[] = [
  { label: "0–12", value: 142 },
  { label: "13–24", value: 218 },
  { label: "25–40", value: 396 },
  { label: "41–60", value: 354 },
  { label: "61–75", value: 241 },
  { label: "75+", value: 118 },
];

export const dateRangeOptions = ["3M", "6M", "12M"] as const;
export type DateRangeOption = (typeof dateRangeOptions)[number];

export function sliceByRange<T>(data: T[], range: DateRangeOption): T[] {
  const counts: Record<DateRangeOption, number> = { "3M": 3, "6M": 6, "12M": 12 };
  const n = counts[range];
  return data.slice(Math.max(0, data.length - n));
}
