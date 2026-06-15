import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

export function Pagination({
  page,
  totalPages,
  onChange,
  total,
  pageSize,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  total?: number;
  pageSize?: number;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
      <p className="text-xs text-ink-faint">
        {total !== undefined && pageSize !== undefined
          ? `Showing ${Math.min((page - 1) * pageSize + 1, total)}\u2013${Math.min(page * pageSize, total)} of ${total}`
          : `Page ${page} of ${totalPages}`}
      </p>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
          Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          Next
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
}
