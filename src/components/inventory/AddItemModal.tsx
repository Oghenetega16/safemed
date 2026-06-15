"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Input";
import { inventoryCategories, inventorySuppliers } from "@/data/inventory";
import { useInventoryStore } from "@/store/useInventoryStore";
import { useToastStore } from "@/store/useToastStore";
import type { NewInventoryItemInput } from "@/store/useInventoryStore";

const initialForm: NewInventoryItemInput = {
  name: "",
  category: inventoryCategories[0],
  stock: 0,
  reorderLevel: 50,
  unit: "units",
  supplier: inventorySuppliers[0],
};

export function AddItemModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState<NewInventoryItemInput>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const addItem = useInventoryStore((s) => s.addItem);
  const showToast = useToastStore((s) => s.show);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Please enter an item name.");
      return;
    }
    const created = addItem(form);
    showToast({ title: "Item added to inventory", description: `${created.name} (${created.sku})`, tone: "success" });
    setForm(initialForm);
    setError(null);
    onClose();
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Add Inventory Item" description="Register a new supply or equipment item" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Item Name" required className="sm:col-span-2">
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Surgical Sutures" required />
          </Field>
          <Field label="Category" required>
            <Select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
              {inventoryCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          </Field>
          <Field label="Supplier" required>
            <Select value={form.supplier} onChange={(e) => setForm((f) => ({ ...f, supplier: e.target.value }))}>
              {inventorySuppliers.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <Field label="Initial Stock" required>
            <Input type="number" min={0} value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))} required />
          </Field>
          <Field label="Reorder Level" required>
            <Input type="number" min={0} value={form.reorderLevel} onChange={(e) => setForm((f) => ({ ...f, reorderLevel: Number(e.target.value) }))} required />
          </Field>
          <Field label="Unit" required className="sm:col-span-2">
            <Input value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))} placeholder="e.g. boxes, vials, units" required />
          </Field>
        </div>

        {error && <p className="text-sm font-medium text-rose">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">Add Item</Button>
        </div>
      </form>
    </Modal>
  );
}
