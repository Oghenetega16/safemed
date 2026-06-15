"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { useInventoryStore } from "@/store/useInventoryStore";
import { useToastStore } from "@/store/useToastStore";
import type { InventoryItem } from "@/types";

export function RestockModal({ item, onClose }: { item: InventoryItem | null; onClose: () => void }) {
  const [quantity, setQuantity] = useState(0);
  const restock = useInventoryStore((s) => s.restock);
  const showToast = useToastStore((s) => s.show);

  useEffect(() => {
    if (item) setQuantity(Math.max(item.reorderLevel, 1));
  }, [item]);

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;
    restock(item.id, quantity);
    showToast({
      title: "Stock updated",
      description: `${item.name}: +${quantity} ${item.unit} (new total: ${item.stock + quantity})`,
      tone: "success",
    });
    onClose();
  };

  return (
    <Modal open={!!item} onClose={onClose} title={`Restock ${item.name}`} description={`Current stock: ${item.stock} ${item.unit} · SKU ${item.sku}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label={`Quantity to add (${item.unit})`} required>
          <Input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} autoFocus required />
        </Field>
        <p className="text-xs text-ink-faint">New total will be {item.stock + quantity} {item.unit}.</p>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Confirm Restock</Button>
        </div>
      </form>
    </Modal>
  );
}
