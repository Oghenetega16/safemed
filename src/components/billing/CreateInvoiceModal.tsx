"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Input";
import { paymentMethods, billingServices } from "@/data/billing";
import { useBillingStore } from "@/store/useBillingStore";
import { useToastStore } from "@/store/useToastStore";
import type { NewInvoiceInput } from "@/store/useBillingStore";

const initialForm: NewInvoiceInput = {
  patientName: "",
  service: billingServices[0],
  amount: 100,
  method: paymentMethods[0],
  date: "2025-02-20",
  dueDate: "2025-03-06",
};

export function CreateInvoiceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState<NewInvoiceInput>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const addInvoice = useBillingStore((s) => s.addInvoice);
  const showToast = useToastStore((s) => s.show);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientName.trim() || form.amount <= 0) {
      setError("Please enter a patient name and a valid amount.");
      return;
    }
    const created = addInvoice(form);
    showToast({
      title: "Invoice created",
      description: `${created.invoiceNo} for ${created.patientName} — $${created.amount.toLocaleString()}`,
      tone: "success",
    });
    setForm(initialForm);
    setError(null);
    onClose();
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Create Invoice" description="Generate a new patient invoice" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Patient Name" required className="sm:col-span-2">
            <Input
              value={form.patientName}
              onChange={(e) => setForm((f) => ({ ...f, patientName: e.target.value }))}
              placeholder="e.g. Alex Morgan"
              required
            />
          </Field>
          <Field label="Service" required>
            <Select value={form.service} onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}>
              {billingServices.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <Field label="Amount (USD)" required>
            <Input
              type="number"
              min={1}
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))}
              required
            />
          </Field>
          <Field label="Payment Method" required>
            <Select value={form.method} onChange={(e) => setForm((f) => ({ ...f, method: e.target.value }))}>
              {paymentMethods.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </Select>
          </Field>
          <Field label="Issue Date" required>
            <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} required />
          </Field>
          <Field label="Due Date" required className="sm:col-span-2">
            <Input type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} required />
          </Field>
        </div>

        {error && <p className="text-sm font-medium text-rose">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">Create Invoice</Button>
        </div>
      </form>
    </Modal>
  );
}
