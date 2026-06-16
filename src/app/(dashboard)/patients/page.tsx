"use client";

import { useMemo, useState } from "react";
import { Plus, Eye, Users, HeartPulse, ShieldAlert, Activity } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { PatientDrawer } from "@/components/patients/PatientDrawer";
import { AddPatientModal } from "@/components/patients/AddPatientModal";
import { usePatientsStore } from "@/store/usePatientsStore";
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/ui/Avatar";
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

const riskWeight: Record<RiskLevel, number> = { High: 3, Moderate: 2, Low: 1 };

const statusFilters: Array<PatientStatus | "All"> = ["All", "Stable", "Critical", "Recovering", "Discharged"];

const PAGE_SIZE = 8;

export default function PatientsPage() {
  const patients = usePatientsStore((s) => s.patients);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PatientStatus | "All">("All");
  const [sortBy, setSortBy] = useState<"name" | "lastVisit" | "risk">("lastVisit");
  const [page, setPage] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const stats = useMemo(() => {
    const total = patients.length;
    const critical = patients.filter((p) => p.status === "Critical").length;
    const recovering = patients.filter((p) => p.status === "Recovering").length;
    const highRisk = patients.filter((p) => p.riskLevel === "High").length;
    return { total, critical, recovering, highRisk };
  }, [patients]);

  const filtered = useMemo(() => {
    let result = patients;

    if (statusFilter !== "All") {
      result = result.filter((p) => p.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.condition.toLowerCase().includes(q) ||
          p.doctor.toLowerCase().includes(q)
      );
    }

    const sorted = [...result];
    if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "lastVisit") {
      sorted.sort((a, b) => (a.lastVisit < b.lastVisit ? 1 : -1));
    } else {
      sorted.sort((a, b) => riskWeight[b.riskLevel] - riskWeight[a.riskLevel]);
    }

    return sorted;
  }, [patients, search, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateFilter = (fn: () => void) => {
    fn();
    setPage(1);
  };

  return (
    <>
      <PageHeader
        title="Patients"
        description="Manage patient records, risk levels and care status across all wards."
        actions={
          <Button onClick={() => setAddOpen(true)}>
            <Plus size={16} />
            Add Patient
          </Button>
        }
      />

      <div className="space-y-4 px-4 lg:px-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatPill icon={Users} label="Total Patients" value={stats.total} tone="brand" />
          <StatPill icon={HeartPulse} label="Critical" value={stats.critical} tone="rose" />
          <StatPill icon={Activity} label="Recovering" value={stats.recovering} tone="sky" />
          <StatPill icon={ShieldAlert} label="High Risk" value={stats.highRisk} tone="amber" />
        </div>

        {/* Filters */}
        <div className="rounded-xl2 border border-border bg-bg-surface p-4 shadow-card">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <SearchInput
              value={search}
              onChange={(v) => updateFilter(() => setSearch(v))}
              placeholder="Search by name, ID, condition or doctor..."
              className="w-full lg:max-w-sm"
            />
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by status">
                {statusFilters.map((status) => (
                  <button
                    key={status}
                    onClick={() => updateFilter(() => setStatusFilter(status))}
                    aria-pressed={statusFilter === status}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                      statusFilter === status
                        ? "bg-brand text-white"
                        : "bg-bg-subtle text-ink-muted hover:text-ink"
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-auto"
                aria-label="Sort patients"
              >
                <option value="lastVisit">Sort: Recent Visit</option>
                <option value="name">Sort: Name (A-Z)</option>
                <option value="risk">Sort: Risk Level</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Table / Cards */}
        {pageItems.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No patients found"
            description="Try adjusting your search or filters to find what you're looking for."
          />
        ) : (
          <div className="rounded-xl2 border border-border bg-bg-surface shadow-card">
            {/* Desktop table */}
            <div className="scrollbar-thin hidden overflow-x-auto lg:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-faint">
                    <th className="px-5 py-3 font-semibold">Patient</th>
                    <th className="px-5 py-3 font-semibold">Age / Gender</th>
                    <th className="px-5 py-3 font-semibold">Condition</th>
                    <th className="px-5 py-3 font-semibold">Ward</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Risk</th>
                    <th className="px-5 py-3 font-semibold">Last Visit</th>
                    <th className="px-5 py-3 font-semibold sr-only">View</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((patient) => (
                    <tr
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className="cursor-pointer border-b border-border last:border-0 transition-colors hover:bg-bg-subtle"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={patient.name} color={patient.avatarColor} size={36} />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-ink">{patient.name}</p>
                            <p className="text-xs text-ink-faint">{patient.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-ink-muted">{patient.age} · {patient.gender}</td>
                      <td className="px-5 py-3 text-ink-muted">{patient.condition}</td>
                      <td className="px-5 py-3 text-ink-muted">{patient.ward}</td>
                      <td className="px-5 py-3">
                        <Badge tone={statusTone[patient.status]}>{patient.status}</Badge>
                      </td>
                      <td className="px-5 py-3">
                        <Badge tone={riskTone[patient.riskLevel]}>{patient.riskLevel}</Badge>
                      </td>
                      <td className="px-5 py-3 text-ink-muted">{patient.lastVisit}</td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPatient(patient);
                          }}
                          className="rounded-lg p-2 text-ink-faint hover:bg-bg-subtle hover:text-brand-600"
                          aria-label={`View ${patient.name}`}
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="divide-y divide-border lg:hidden">
              {pageItems.map((patient) => (
                <li key={patient.id}>
                  <button
                    onClick={() => setSelectedPatient(patient)}
                    className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-bg-subtle"
                  >
                    <Avatar name={patient.name} color={patient.avatarColor} size={40} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{patient.name}</p>
                      <p className="truncate text-xs text-ink-faint">{patient.condition} · {patient.ward}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        <Badge tone={statusTone[patient.status]}>{patient.status}</Badge>
                        <Badge tone={riskTone[patient.riskLevel]}>{patient.riskLevel} Risk</Badge>
                      </div>
                    </div>
                    <Eye size={16} className="shrink-0 text-ink-faint" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="px-5 pb-4">
              <Pagination page={page} totalPages={totalPages} onChange={setPage} total={filtered.length} pageSize={PAGE_SIZE} />
            </div>
          </div>
        )}
      </div>

      <PatientDrawer patient={selectedPatient} open={!!selectedPatient} onClose={() => setSelectedPatient(null)} />
      <AddPatientModal open={addOpen} onClose={() => setAddOpen(false)} />
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
  value: number;
  tone: "brand" | "rose" | "sky" | "amber";
}) {
  const toneClasses = {
    brand: "bg-brand-50 text-brand-600",
    rose: "bg-rose-soft text-rose",
    sky: "bg-sky-soft text-sky",
    amber: "bg-amber-soft text-amber",
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
