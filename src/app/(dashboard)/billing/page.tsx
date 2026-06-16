"use client";

import { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Plus, DollarSign, Wallet, CheckCircle2, AlertTriangle, CreditCard } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { Avatar } from "@/components/ui/Avatar";
import { CreateInvoiceModal } from "@/components/billing/CreateInvoiceModal";
import { useBillingStore } from "@/store/useBillingStore";
import { useToastStore } from "@/store/useToastStore";
import { revenueTrend } from "@/data/billing";
import { cn } from "@/lib/cn";
import type { Invoice, InvoiceStatus } from "@/types";

const statusTone: Record<InvoiceStatus, "mint" | "amber" | "rose"> = {
  Paid: "mint",
  Pending: "amber",
  Overdue: "rose",
};

const statusFilters: Array<InvoiceStatus | "All"> = ["All", "Paid", "Pending", "Overdue"];
const PAGE_SIZE = 8;

const currency = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function BillingPage() {
  const { invoices, setStatus } = useBillingStore();
  const showToast = useToastStore((s) => s.show);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "All">("All");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "patient">("date");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);

  const stats = useMemo(() => {
    const totalRevenue = invoices.filter((i) => i.status === "Paid").reduce((sum, i) => sum + i.amount, 0);
    const outstanding = invoices.filter((i) => i.status !== "Paid").reduce((sum, i) => sum + i.amount, 0);
    const paidCount = invoices.filter((i) => i.status === "Paid").length;
    const overdueCount = invoices.filter((i) => i.status === "Overdue").length;
    return { totalRevenue, outstanding, paidCount, overdueCount };
  }, [invoices]);

  const filtered = useMemo(() => {
    let result = invoices;
    if (statusFilter !== "All") result = result.filter((i) => i.status === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (i) => i.patientName.toLowerCase().includes(q) || i.invoiceNo.toLowerCase().includes(q) || i.service.toLowerCase().includes(q)
      );
    }
    const sorted = [...result];
    if (sortBy === "date") sorted.sort((a, b) => (a.date < b.date ? 1 : -1));
    else if (sortBy === "amount") sorted.sort((a, b) => b.amount - a.amount);
    else sorted.sort((a, b) => a.patientName.localeCompare(b.patientName));
    return sorted;
  }, [invoices, search, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateFilter = (fn: () => void) => {
    fn();
    setPage(1);
  };

  const handleMarkPaid = (invoice: Invoice) => {
    setStatus(invoice.id, "Paid");
    showToast({ title: "Invoice marked as paid", description: `${invoice.invoiceNo} · ${currency(invoice.amount)}`, tone: "success" });
  };

  return (
    <>
      <PageHeader
        title="Billing & Revenue"
        description="Track revenue performance and manage patient invoices."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus size={16} />
            Create Invoice
          </Button>
        }
      />

      <div className="space-y-4 px-4 lg:px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatPill icon={DollarSign} label="Total Revenue (Paid)" value={currency(stats.totalRevenue)} tone="mint" />
          <StatPill icon={Wallet} label="Outstanding" value={currency(stats.outstanding)} tone="amber" />
          <StatPill icon={CheckCircle2} label="Paid Invoices" value={stats.paidCount} tone="brand" />
          <StatPill icon={AlertTriangle} label="Overdue" value={stats.overdueCount} tone="rose" />
        </div>

        {/* Revenue chart */}
        <div className="rounded-xl2 border border-border bg-bg-surface p-5 shadow-card">
          <h2 className="text-base font-bold text-ink">Revenue vs. Expenses</h2>
          <p className="mt-0.5 text-xs text-ink-faint">Monthly trend over the last 12 months</p>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3E6BFF" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#3E6BFF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8C6CFF" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#8C6CFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#ECEEF6" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8B90A8" }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: "#8B90A8" }}
                  axisLine={false}
                  tickLine={false}
                  width={48}
                  tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #ECEEF6", fontSize: 12 }}
                  labelStyle={{ fontWeight: 700 }}
                  formatter={(value: number) => currency(value)}
                />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3E6BFF" strokeWidth={2.5} fill="url(#revenueGradient)" />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#8C6CFF" strokeWidth={2.5} fill="url(#expensesGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex gap-4 text-xs text-ink-muted">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-brand" /> Revenue</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet" /> Expenses</span>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-xl2 border border-border bg-bg-surface p-4 shadow-card">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <SearchInput value={search} onChange={(v) => updateFilter(() => setSearch(v))} placeholder="Search invoice #, patient or service..." className="w-full lg:max-w-sm" />
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by status">
                {statusFilters.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateFilter(() => setStatusFilter(s))}
                    aria-pressed={statusFilter === s}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                      statusFilter === s ? "bg-brand text-white" : "bg-bg-subtle text-ink-muted hover:text-ink"
                    )}
                  >
                    {s === "All" ? "All" : s}
                  </button>
                ))}
              </div>
              <Select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="w-auto" aria-label="Sort invoices">
                <option value="date">Sort: Date</option>
                <option value="amount">Sort: Amount</option>
                <option value="patient">Sort: Patient Name</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Table */}
        {pageItems.length === 0 ? (
          <EmptyState icon={CreditCard} title="No invoices found" description="Try adjusting your search or filters." />
        ) : (
          <div className="rounded-xl2 border border-border bg-bg-surface shadow-card">
            <div className="scrollbar-thin hidden overflow-x-auto lg:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-faint">
                    <th className="px-5 py-3 font-semibold">Invoice</th>
                    <th className="px-5 py-3 font-semibold">Patient</th>
                    <th className="px-5 py-3 font-semibold">Service</th>
                    <th className="px-5 py-3 font-semibold">Date / Due</th>
                    <th className="px-5 py-3 font-semibold">Method</th>
                    <th className="px-5 py-3 font-semibold">Amount</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((inv) => (
                    <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-bg-subtle">
                      <td className="px-5 py-3 font-semibold text-ink">{inv.invoiceNo}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={inv.patientName} color={inv.avatarColor} size={32} />
                          <span className="text-ink-muted">{inv.patientName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-ink-muted">{inv.service}</td>
                      <td className="px-5 py-3 text-ink-muted">
                        {inv.date}
                        <br />
                        <span className="text-xs text-ink-faint">Due {inv.dueDate}</span>
                      </td>
                      <td className="px-5 py-3 text-ink-muted">{inv.method}</td>
                      <td className="px-5 py-3 font-bold text-ink">{currency(inv.amount)}</td>
                      <td className="px-5 py-3">
                        <Badge tone={statusTone[inv.status]}>{inv.status}</Badge>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {inv.status !== "Paid" ? (
                          <Button size="sm" variant="success" onClick={() => handleMarkPaid(inv)}>
                            Mark Paid
                          </Button>
                        ) : (
                          <span className="text-xs text-ink-faint">Settled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="divide-y divide-border lg:hidden">
              {pageItems.map((inv) => (
                <li key={inv.id} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <Avatar name={inv.patientName} color={inv.avatarColor} size={36} />
                      <div>
                        <p className="text-sm font-semibold text-ink">{inv.patientName}</p>
                        <p className="text-xs text-ink-faint">{inv.invoiceNo} · {inv.service}</p>
                      </div>
                    </div>
                    <Badge tone={statusTone[inv.status]}>{inv.status}</Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-xs text-ink-muted">
                      {inv.date} · Due {inv.dueDate}
                      <br />
                      <span className="font-bold text-ink">{currency(inv.amount)}</span>
                    </div>
                    {inv.status !== "Paid" && (
                      <Button size="sm" variant="success" onClick={() => handleMarkPaid(inv)}>
                        Mark Paid
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="px-5 pb-4">
              <Pagination page={page} totalPages={totalPages} onChange={setPage} total={filtered.length} pageSize={PAGE_SIZE} />
            </div>
          </div>
        )}
      </div>

      <CreateInvoiceModal open={createOpen} onClose={() => setCreateOpen(false)} />
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
  tone: "brand" | "mint" | "amber" | "rose";
}) {
  const toneClasses = {
    brand: "bg-brand-50 text-brand-600",
    mint: "bg-mint-soft text-mint",
    amber: "bg-amber-soft text-amber",
    rose: "bg-rose-soft text-rose",
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
