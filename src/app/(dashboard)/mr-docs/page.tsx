"use client";

import { useMemo, useState } from "react";
import { FileText, Image as ImageIcon, File, Upload, Download, LayoutGrid, List as ListIcon, FolderOpen, FlaskConical, ScanLine, Pill } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { Drawer } from "@/components/ui/Drawer";
import { UploadDocumentModal } from "@/components/documents/UploadDocumentModal";
import { useDocumentsStore } from "@/store/useDocumentsStore";
import { useToastStore } from "@/store/useToastStore";
import { documentTypes } from "@/data/documents";
import { cn } from "@/lib/cn";
import type { DocumentType, FileKind, MedicalDocument } from "@/types";

const fileKindIconWrap: Record<FileKind, string> = {
  pdf: "bg-rose-soft text-rose",
  image: "bg-sky-soft text-sky",
  doc: "bg-violet-soft text-violet",
};

const fileKindIcon: Record<FileKind, React.ComponentType<{ size?: number; className?: string }>> = {
  pdf: FileText,
  image: ImageIcon,
  doc: File,
};

const typeFilters: Array<DocumentType | "All"> = ["All", ...documentTypes];
const PAGE_SIZE = 8;

export default function MrDocsPage() {
  const documents = useDocumentsStore((s) => s.documents);
  const showToast = useToastStore((s) => s.show);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<DocumentType | "All">("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<MedicalDocument | null>(null);

  const stats = useMemo(() => {
    const total = documents.length;
    const labReports = documents.filter((d) => d.type === "Lab Report").length;
    const imaging = documents.filter((d) => d.type === "Imaging").length;
    const prescriptions = documents.filter((d) => d.type === "Prescription").length;
    return { total, labReports, imaging, prescriptions };
  }, [documents]);

  const filtered = useMemo(() => {
    let result = documents;
    if (typeFilter !== "All") result = result.filter((d) => d.type === typeFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((d) => d.name.toLowerCase().includes(q) || d.patientName.toLowerCase().includes(q) || d.doctor.toLowerCase().includes(q));
    }
    return [...result].sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [documents, search, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateFilter = (fn: () => void) => {
    fn();
    setPage(1);
  };

  const handleDownload = (doc: MedicalDocument) => {
    showToast({ title: "Download started", description: `${doc.name} (${doc.size})`, tone: "info" });
  };

  return (
    <>
      <PageHeader
        title="MR & Docs"
        description="Browse, preview and manage patient medical records and documents."
        actions={
          <Button onClick={() => setUploadOpen(true)}>
            <Upload size={16} />
            Upload Document
          </Button>
        }
      />

      <div className="space-y-4 px-4 lg:px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatPill icon={FolderOpen} label="Total Documents" value={stats.total} tone="brand" />
          <StatPill icon={FlaskConical} label="Lab Reports" value={stats.labReports} tone="violet" />
          <StatPill icon={ScanLine} label="Imaging" value={stats.imaging} tone="sky" />
          <StatPill icon={Pill} label="Prescriptions" value={stats.prescriptions} tone="mint" />
        </div>

        {/* Filters */}
        <div className="rounded-xl2 border border-border bg-bg-surface p-4 shadow-card">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <SearchInput value={search} onChange={(v) => updateFilter(() => setSearch(v))} placeholder="Search documents, patients or doctors..." className="w-full lg:max-w-sm" />
            <div className="flex flex-wrap items-center gap-2">
              <Select value={typeFilter} onChange={(e) => updateFilter(() => setTypeFilter(e.target.value as typeof typeFilter))} className="w-auto" aria-label="Filter by document type">
                {typeFilters.map((t) => (
                  <option key={t} value={t}>
                    {t === "All" ? "All Types" : t}
                  </option>
                ))}
              </Select>
              <div className="flex items-center gap-1 rounded-xl bg-bg-subtle p-1">
                <button
                  onClick={() => setView("grid")}
                  aria-pressed={view === "grid"}
                  aria-label="Grid view"
                  className={cn("rounded-lg p-1.5 transition-colors", view === "grid" ? "bg-bg-surface text-ink shadow-card" : "text-ink-muted hover:text-ink")}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setView("list")}
                  aria-pressed={view === "list"}
                  aria-label="List view"
                  className={cn("rounded-lg p-1.5 transition-colors", view === "list" ? "bg-bg-surface text-ink shadow-card" : "text-ink-muted hover:text-ink")}
                >
                  <ListIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {pageItems.length === 0 ? (
          <EmptyState icon={FolderOpen} title="No documents found" description="Try adjusting your search or filters, or upload a new document." />
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pageItems.map((doc) => {
              const Icon = fileKindIcon[doc.fileKind];
              return (
                <button
                  key={doc.id}
                  onClick={() => setPreviewDoc(doc)}
                  className="flex flex-col rounded-xl2 border border-border bg-bg-surface p-4 text-left shadow-card transition-shadow hover:shadow-soft"
                >
                  <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", fileKindIconWrap[doc.fileKind])}>
                    <Icon size={20} />
                  </div>
                  <p className="mt-3 truncate text-sm font-bold text-ink">{doc.name}</p>
                  <p className="truncate text-xs text-ink-faint">{doc.patientName}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge tone="neutral">{doc.type}</Badge>
                    <span className="text-xs text-ink-faint">{doc.size}</span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl2 border border-border bg-bg-surface shadow-card">
            <ul className="divide-y divide-border">
              {pageItems.map((doc) => {
                const Icon = fileKindIcon[doc.fileKind];
                return (
                  <li key={doc.id}>
                    <button onClick={() => setPreviewDoc(doc)} className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-bg-subtle">
                      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", fileKindIconWrap[doc.fileKind])}>
                        <Icon size={18} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">{doc.name}</p>
                        <p className="truncate text-xs text-ink-faint">{doc.patientName} · {doc.doctor} · {doc.date}</p>
                      </div>
                      <Badge tone="neutral" className="hidden sm:inline-flex">{doc.type}</Badge>
                      <span className="hidden w-16 shrink-0 text-right text-xs text-ink-faint sm:inline">{doc.size}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onChange={setPage} total={filtered.length} pageSize={PAGE_SIZE} />
      </div>

      <UploadDocumentModal open={uploadOpen} onClose={() => setUploadOpen(false)} />

      <Drawer
        open={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        title={previewDoc?.name ?? ""}
        description={previewDoc ? `${previewDoc.patientName} · ${previewDoc.type}` : undefined}
        footer={
          previewDoc && (
            <Button onClick={() => handleDownload(previewDoc)}>
              <Download size={15} />
              Download
            </Button>
          )
        }
      >
        {previewDoc && (
          <div className="space-y-4">
            <div className={cn("flex h-40 items-center justify-center rounded-xl2", fileKindIconWrap[previewDoc.fileKind])}>
              {(() => {
                const Icon = fileKindIcon[previewDoc.fileKind];
                return <Icon size={56} />;
              })()}
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-border bg-bg-subtle p-3">
                <dt className="text-xs text-ink-faint">Patient</dt>
                <dd className="font-semibold text-ink">{previewDoc.patientName}</dd>
              </div>
              <div className="rounded-xl border border-border bg-bg-subtle p-3">
                <dt className="text-xs text-ink-faint">Document Type</dt>
                <dd className="font-semibold text-ink">{previewDoc.type}</dd>
              </div>
              <div className="rounded-xl border border-border bg-bg-subtle p-3">
                <dt className="text-xs text-ink-faint">Issued By</dt>
                <dd className="font-semibold text-ink">{previewDoc.doctor}</dd>
              </div>
              <div className="rounded-xl border border-border bg-bg-subtle p-3">
                <dt className="text-xs text-ink-faint">Date</dt>
                <dd className="font-semibold text-ink">{previewDoc.date}</dd>
              </div>
              <div className="rounded-xl border border-border bg-bg-subtle p-3 col-span-2">
                <dt className="text-xs text-ink-faint">File Size</dt>
                <dd className="font-semibold text-ink">{previewDoc.size}</dd>
              </div>
            </dl>
          </div>
        )}
      </Drawer>
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
  tone: "brand" | "violet" | "sky" | "mint";
}) {
  const toneClasses = {
    brand: "bg-brand-50 text-brand-600",
    violet: "bg-violet-soft text-violet",
    sky: "bg-sky-soft text-sky",
    mint: "bg-mint-soft text-mint",
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
