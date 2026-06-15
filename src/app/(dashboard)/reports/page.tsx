"use client";

import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Download, DollarSign, Users, Star, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { useToastStore } from "@/store/useToastStore";
import { usePatientsStore } from "@/store/usePatientsStore";
import { useAppointmentsStore } from "@/store/useAppointmentsStore";
import { revenueTrend } from "@/data/billing";
import { admissionsTrend, departmentPerformance, ageDemographics, dateRangeOptions, sliceByRange, type DateRangeOption } from "@/data/reports";
import { cn } from "@/lib/cn";

const currency = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const appointmentStatusColors: Record<string, string> = {
  confirmed: "#1FCB8F",
  pending: "#FFB648",
  completed: "#3EA8FF",
  cancelled: "#FF6B81",
};

const riskColors: Record<string, string> = {
  Low: "#1FCB8F",
  Moderate: "#FFB648",
  High: "#FF6B81",
};

export default function ReportsPage() {
  const showToast = useToastStore((s) => s.show);
  const patients = usePatientsStore((s) => s.patients);
  const appointments = useAppointmentsStore((s) => s.appointments);
  const [range, setRange] = useState<DateRangeOption>("12M");

  const revenueData = useMemo(() => sliceByRange(revenueTrend, range), [range]);
  const admissionsData = useMemo(() => sliceByRange(admissionsTrend, range), [range]);

  const stats = useMemo(() => {
    const totalRevenue = revenueTrend.reduce((sum, p) => sum + p.revenue, 0);
    const avgSatisfaction = Math.round(departmentPerformance.reduce((sum, d) => sum + d.satisfaction, 0) / departmentPerformance.length);
    const completed = appointments.filter((a) => a.status === "completed").length;
    const completionRate = appointments.length ? Math.round((completed / appointments.length) * 100) : 0;
    return { totalRevenue, totalPatients: patients.length, avgSatisfaction, completionRate };
  }, [patients, appointments]);

  const appointmentStatusData = useMemo(() => {
    const counts: Record<string, number> = { confirmed: 0, pending: 0, completed: 0, cancelled: 0 };
    appointments.forEach((a) => {
      counts[a.status] = (counts[a.status] ?? 0) + 1;
    });
    return Object.entries(counts).map(([status, value]) => ({ name: status, value, color: appointmentStatusColors[status] }));
  }, [appointments]);

  const riskData = useMemo(() => {
    const counts: Record<string, number> = { Low: 0, Moderate: 0, High: 0 };
    patients.forEach((p) => {
      counts[p.riskLevel] = (counts[p.riskLevel] ?? 0) + 1;
    });
    return Object.entries(counts).map(([level, value]) => ({ name: level, value, color: riskColors[level] }));
  }, [patients]);

  const maxDeptPatients = Math.max(...departmentPerformance.map((d) => d.patients));

  return (
    <>
      <PageHeader
        title="Reports & Analytics"
        description="Operational, financial and clinical performance at a glance."
        actions={
          <>
            <div className="flex items-center gap-1 rounded-xl bg-bg-subtle p-1">
              {dateRangeOptions.map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  aria-pressed={range === r}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                    range === r ? "bg-bg-surface text-ink shadow-card" : "text-ink-muted hover:text-ink"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              onClick={() => showToast({ title: "Report exported", description: "Your analytics report has been generated as a PDF.", tone: "success" })}
            >
              <Download size={15} />
              Export Report
            </Button>
          </>
        }
      />

      <div className="space-y-4 px-4 lg:px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatPill icon={DollarSign} label="Total Revenue (YTD)" value={currency(stats.totalRevenue)} tone="mint" />
          <StatPill icon={Users} label="Total Patients" value={stats.totalPatients} tone="brand" />
          <StatPill icon={Star} label="Avg. Satisfaction" value={`${stats.avgSatisfaction}%`} tone="violet" />
          <StatPill icon={CheckCircle2} label="Appointment Completion" value={`${stats.completionRate}%`} tone="sky" />
        </div>

        {/* Revenue trend */}
        <div className="rounded-xl2 border border-border bg-bg-surface p-5 shadow-card">
          <h2 className="text-base font-bold text-ink">Revenue vs. Expenses</h2>
          <p className="mt-0.5 text-xs text-ink-faint">Last {range === "12M" ? "12 months" : range === "6M" ? "6 months" : "3 months"}</p>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="reportRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3E6BFF" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#3E6BFF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="reportExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8C6CFF" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#8C6CFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#ECEEF6" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8B90A8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#8B90A8" }} axisLine={false} tickLine={false} width={48} tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #ECEEF6", fontSize: 12 }} labelStyle={{ fontWeight: 700 }} formatter={(value: number) => currency(value)} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3E6BFF" strokeWidth={2.5} fill="url(#reportRevenue)" />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#8C6CFF" strokeWidth={2.5} fill="url(#reportExpenses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Admissions trend */}
          <div className="rounded-xl2 border border-border bg-bg-surface p-5 shadow-card lg:col-span-2">
            <h2 className="text-base font-bold text-ink">Admissions Trend</h2>
            <p className="mt-0.5 text-xs text-ink-faint">Inpatient vs. outpatient visits</p>
            <div className="mt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={admissionsData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="#ECEEF6" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8B90A8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#8B90A8" }} axisLine={false} tickLine={false} width={32} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #ECEEF6", fontSize: 12 }} labelStyle={{ fontWeight: 700 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="inpatient" name="Inpatient" fill="#3E6BFF" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="outpatient" name="Outpatient" fill="#3EE0D1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department performance */}
          <div className="rounded-xl2 border border-border bg-bg-surface p-5 shadow-card">
            <h2 className="text-base font-bold text-ink">Department Performance</h2>
            <p className="mt-0.5 text-xs text-ink-faint">Patient volume &amp; satisfaction</p>
            <ul className="mt-4 space-y-3">
              {departmentPerformance.map((dept) => (
                <li key={dept.department}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-ink">{dept.department}</span>
                    <span className="text-ink-faint">{dept.patients} pts · {dept.satisfaction}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-bg-subtle">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${(dept.patients / maxDeptPatients) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Age demographics */}
          <div className="rounded-xl2 border border-border bg-bg-surface p-5 shadow-card">
            <h2 className="text-base font-bold text-ink">Patient Demographics</h2>
            <p className="mt-0.5 text-xs text-ink-faint">By age group</p>
            <div className="mt-4 h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageDemographics} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="#ECEEF6" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#8B90A8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#8B90A8" }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #ECEEF6", fontSize: 12 }} />
                  <Bar dataKey="value" name="Patients" fill="#8C6CFF" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Appointment status breakdown (live) */}
          <div className="rounded-xl2 border border-border bg-bg-surface p-5 shadow-card">
            <h2 className="text-base font-bold text-ink">Appointment Status</h2>
            <p className="mt-0.5 text-xs text-ink-faint">Live across all scheduled visits</p>
            <div className="mt-4 h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={appointmentStatusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={3} cornerRadius={6}>
                    {appointmentStatusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #ECEEF6", fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11, textTransform: "capitalize" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Patient risk distribution (live) */}
          <div className="rounded-xl2 border border-border bg-bg-surface p-5 shadow-card">
            <h2 className="text-base font-bold text-ink">Patient Risk Distribution</h2>
            <p className="mt-0.5 text-xs text-ink-faint">Live across current patients</p>
            <div className="mt-4 h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75} paddingAngle={3} cornerRadius={6}>
                    {riskData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #ECEEF6", fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StatPill({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: number | string;
  tone: "brand" | "mint" | "violet" | "sky";
}) {
  const toneClasses = {
    brand: "bg-brand-50 text-brand-600",
    mint: "bg-mint-soft text-mint",
    violet: "bg-violet-soft text-violet",
    sky: "bg-sky-soft text-sky",
  };
  return (
    <div className="rounded-xl2 border border-border bg-bg-surface p-4 shadow-card">
      <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", toneClasses[tone])}>
        <Icon size={17} />
      </div>
      <p className="mt-3 text-2xl font-extrabold tracking-tight text-ink">{value}</p>
      <p className="text-xs font-medium text-ink-muted">{label}</p>
    </div>
  );
}
