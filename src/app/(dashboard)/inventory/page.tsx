"use client";

import { useMemo, useState } from "react";
import { Plus, Boxes, AlertTriangle, XCircle, Layers, PackagePlus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { AddItemModal } from "@/components/inventory/AddItemModal";
import { RestockModal } from "@/components/inventory/RestockModal";
import { useInventoryStore } from "@/store/useInventoryStore";
import { inventoryCategories, getInventoryStatus, getStockPercent } from "@/data/inventory";
import { cn } from "@/lib/cn";
import type { InventoryItem, InventoryStatus } from "@/types";

const statusTone: Record<InventoryStatus, "mint" | "amber" | "rose"> = {
  "In Stock": "mint",
  "Low Stock": "amber",
  "Out of Stock": "rose",
};

const statusBar: Record<InventoryStatus, string> = {
  "In Stock": "bg-mint",
  "Low Stock": "bg-amber",
  "Out of Stock": "bg-rose",
};

const statusFilters: Array<InventoryStatus | "All"> = ["All", "In Stock", "Low Stock", "Out of Stock"];
const PAGE_SIZE = 8;

export default function InventoryPage() {
  const items = useInventoryStore((s) => s.items);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<InventoryStatus | "All">("All");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [restockItem, setRestockItem] = useState<InventoryItem | null>(null);

  const stats = useMemo(() => {
    const total = items.length;
    const lowStock = items.filter((i) => getInventoryStatus(i) === "Low Stock").length;
    const outOfStock = items.filter((i) => getInventoryStatus(i) === "Out of Stock").length;
    const categories = new Set(items.map((i) => i.category)).size;
    return { total, lowStock, outOfStock, categories };
  }, [items]);

  const filtered = useMemo(() => {
    let result = items;
    if (categoryFilter !== "All") result = result.filter((i) => i.category === categoryFilter);
    if (statusFilter !== "All") result = result.filter((i) => getInventoryStatus(i) === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((i) => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q) || i.supplier.toLowerCase().includes(q));
    }
    return result;
  }, [items, search, categoryFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateFilter = (fn: () => void) => {
    fn();
    setPage(1);
  };

  return (
    <>
      <PageHeader
        title="Inventory & Supplies"
        description="Track stock levels, reorder thresholds and suppliers across the hospital."
        actions={
          <Button onClick={() => setAddOpen(true)}>
            <Plus size={16} />
            Add Item
          </Button>
        }
      />

      <div className="space-y-4 px-4 lg:px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatPill icon={Boxes} label="Total Items" value={stats.total} tone="brand" />
          <StatPill icon={AlertTriangle} label="Low Stock" value={stats.lowStock} tone="amber" />
          <StatPill icon={XCircle} label="Out of Stock" value={stats.outOfStock} tone="rose" />
          <StatPill icon={Layers} label="Categories" value={stats.categories} tone="violet" />
        </div>

        {/* Filters */}
        <div className="rounded-xl2 border border-border bg-bg-surface p-4 shadow-card">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <SearchInput value={search} onChange={(v) => updateFilter(() => setSearch(v))} placeholder="Search item, SKU or supplier..." className="w-full lg:max-w-sm" />
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
              <Select value={categoryFilter} onChange={(e) => updateFilter(() => setCategoryFilter(e.target.value))} className="w-auto border border-dashed text-sm" aria-label="Filter by category">
                <option value="All">All Categories</option>
                {inventoryCategories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        {pageItems.length === 0 ? (
          <EmptyState icon={Boxes} title="No inventory items found" description="Try adjusting your search or filters." />
        ) : (
          <div className="rounded-xl2 border border-border bg-bg-surface shadow-card">
            <div className="scrollbar-thin hidden overflow-x-auto lg:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-ink-faint">
                    <th className="px-5 py-3 font-semibold">Item</th>
                    <th className="px-5 py-3 font-semibold">Category</th>
                    <th className="px-5 py-3 font-semibold">Stock Level</th>
                    <th className="px-5 py-3 font-semibold">Reorder At</th>
                    <th className="px-5 py-3 font-semibold">Supplier</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((item) => {
                    const status = getInventoryStatus(item);
                    const pct = getStockPercent(item);
                    return (
                      <tr key={item.id} className="border-b border-border last:border-0 hover:bg-bg-subtle">
                        <td className="px-5 py-3">
                          <p className="font-semibold text-ink">{item.name}</p>
                          <p className="text-xs text-ink-faint">{item.sku}</p>
                        </td>
                        <td className="px-5 py-3 text-ink-muted">{item.category}</td>
                        <td className="px-5 py-3">
                          <p className="text-sm font-semibold text-ink">{item.stock.toLocaleString()} {item.unit}</p>
                          <div className="mt-1 h-1.5 w-32 overflow-hidden rounded-full bg-bg-subtle">
                            <div className={cn("h-full rounded-full", statusBar[status])} style={{ width: `${pct}%` }} />
                          </div>
                        </td>
                        <td className="px-5 py-3 text-ink-muted">{item.reorderLevel.toLocaleString()} {item.unit}</td>
                        <td className="px-5 py-3 text-ink-muted">{item.supplier}</td>
                        <td className="px-5 py-3">
                          <Badge tone={statusTone[status]}>{status}</Badge>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <Button size="sm" variant="outline" onClick={() => setRestockItem(item)}>
                            <PackagePlus size={13} />
                            Restock
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="divide-y divide-border lg:hidden">
              {pageItems.map((item) => {
                const status = getInventoryStatus(item);
                const pct = getStockPercent(item);
                return (
                  <li key={item.id} className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-ink">{item.name}</p>
                        <p className="text-xs text-ink-faint">{item.sku} · {item.category}</p>
                      </div>
                      <Badge tone={statusTone[status]}>{status}</Badge>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-ink">{item.stock.toLocaleString()} {item.unit}</p>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-bg-subtle">
                      <div className={cn("h-full rounded-full", statusBar[status])} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-ink-faint">
                      <span>Reorder at {item.reorderLevel.toLocaleString()} {item.unit}</span>
                      <span>{item.supplier}</span>
                    </div>
                    <div className="mt-2">
                      <Button size="sm" variant="outline" onClick={() => setRestockItem(item)}>
                        <PackagePlus size={13} />
                        Restock
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="px-5 pb-4">
              <Pagination page={page} totalPages={totalPages} onChange={setPage} total={filtered.length} pageSize={PAGE_SIZE} />
            </div>
          </div>
        )}
      </div>

      <AddItemModal open={addOpen} onClose={() => setAddOpen(false)} />
      <RestockModal item={restockItem} onClose={() => setRestockItem(null)} />
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
  tone: "brand" | "amber" | "rose" | "violet";
}) {
  const toneClasses = {
    brand: "bg-brand-50 text-brand-600",
    amber: "bg-amber-soft text-amber",
    rose: "bg-rose-soft text-rose",
    violet: "bg-violet-soft text-violet",
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
