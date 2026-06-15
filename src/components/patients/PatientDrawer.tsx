"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Phone, Mail, Droplet, BedDouble, Stethoscope, CalendarDays, Clock } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import type { Patient, PatientStatus, RiskLevel } from "@/types";

const statusTone: Record<PatientStatus, "mint" | "rose" | "sky" | "neutral"> = {
  Stable: "mint",
  Critical: "rose",
  Recovering: "sky",
  Discharged: "neutral",
};

const riskTone: Record<RiskLevel, "mint" | "amber" | "rose"> = {
  Low: "mint",
  Moderate: "amber",
  High: "rose",
};

const vitalTone: Record<Patient["vitals"][number]["status"], string> = {
  normal: "text-mint",
  warning: "text-amber",
  critical: "text-rose",
};

export function PatientDrawer({
  patient,
  open,
  onClose,
}: {
  patient: Patient | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!patient) return null;

  return (
    <Drawer open={open} onClose={onClose} title={patient.name} description={`${patient.id} · ${patient.condition}`}>
      <div className="flex items-center gap-3">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
          style={{ backgroundColor: patient.avatarColor }}
          aria-hidden="true"
        >
          {patient.name.charAt(0)}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={statusTone[patient.status]}>{patient.status}</Badge>
          <Badge tone={riskTone[patient.riskLevel]}>{patient.riskLevel} Risk</Badge>
        </div>
      </div>

      <div className="mt-5">
        <Tabs tabs={[{ id: "overview", label: "Overview" }, { id: "vitals", label: "Vitals" }, { id: "history", label: "History" }]}>
          {(active) => {
            if (active === "overview") {
              return (
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <InfoRow icon={CalendarDays} label="Age / Gender" value={`${patient.age} years · ${patient.gender}`} />
                  <InfoRow icon={Droplet} label="Blood Type" value={patient.bloodType} />
                  <InfoRow icon={BedDouble} label="Ward" value={patient.ward} />
                  <InfoRow icon={Stethoscope} label="Attending Doctor" value={patient.doctor} />
                  <InfoRow icon={Phone} label="Phone" value={patient.phone} />
                  <InfoRow icon={Mail} label="Email" value={patient.email} />
                  <InfoRow icon={Clock} label="Admission Date" value={patient.admissionDate} />
                  <InfoRow icon={Clock} label="Last Visit" value={patient.lastVisit} />
                </dl>
              );
            }

            if (active === "vitals") {
              return (
                <div className="space-y-5">
                  <ul className="grid grid-cols-2 gap-3">
                    {patient.vitals.map((vital) => (
                      <li key={vital.label} className="rounded-xl border border-border bg-bg-subtle p-3">
                        <p className="text-xs text-ink-faint">{vital.label}</p>
                        <p className={`mt-1 text-base font-bold ${vitalTone[vital.status]}`}>{vital.value}</p>
                      </li>
                    ))}
                  </ul>
                  <div>
                    <h3 className="text-sm font-bold text-ink">7-Day Trend</h3>
                    <div className="mt-2 h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={patient.vitalsTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                          <CartesianGrid stroke="#ECEEF6" vertical={false} />
                          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#8B90A8" }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: "#8B90A8" }} axisLine={false} tickLine={false} width={32} />
                          <Tooltip
                            contentStyle={{ borderRadius: 12, border: "1px solid #ECEEF6", fontSize: 12 }}
                            labelStyle={{ fontWeight: 700 }}
                          />
                          <Line type="monotone" dataKey="heartRate" name="Heart Rate" stroke="#FF6B81" strokeWidth={2.5} dot={false} />
                          <Line type="monotone" dataKey="spo2" name="SpO₂" stroke="#3EA8FF" strokeWidth={2.5} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-2 flex gap-4 text-xs text-ink-muted">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-rose" /> Heart Rate (bpm)
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-sky" /> SpO₂ (%)
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <ol className="space-y-4 border-l border-border pl-4">
                {patient.history.map((entry, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-brand ring-4 ring-brand-50" />
                    <p className="text-xs font-semibold text-ink-faint">{entry.date}</p>
                    <p className="mt-0.5 text-sm font-bold text-ink">{entry.title}</p>
                    <p className="mt-0.5 text-sm text-ink-muted">{entry.description}</p>
                  </li>
                ))}
              </ol>
            );
          }}
        </Tabs>
      </div>
    </Drawer>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-bg-subtle p-3">
      <Icon size={16} className="mt-0.5 shrink-0 text-ink-faint" />
      <div className="min-w-0">
        <dt className="text-xs text-ink-faint">{label}</dt>
        <dd className="truncate text-sm font-semibold text-ink">{value}</dd>
      </div>
    </div>
  );
}
