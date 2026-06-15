import { create } from "zustand";
import { invoices as initialInvoices } from "@/data/billing";
import type { Invoice, InvoiceStatus } from "@/types";

const avatarColors = ["#3E6BFF", "#FF6B81", "#1FCB8F", "#FFB648", "#8C6CFF", "#3EA8FF", "#FF9F6B", "#3EE0D1"];

export interface NewInvoiceInput {
  patientName: string;
  service: string;
  amount: number;
  method: string;
  date: string;
  dueDate: string;
}

interface BillingState {
  invoices: Invoice[];
  addInvoice: (input: NewInvoiceInput) => Invoice;
  setStatus: (id: string, status: InvoiceStatus) => void;
}

export const useBillingStore = create<BillingState>((set, get) => ({
  invoices: initialInvoices,
  addInvoice: (input) => {
    const sequence = get().invoices.length + 1;
    const invoice: Invoice = {
      id: `INV-${3000 + sequence}`,
      invoiceNo: `INV-2025-0${300 + sequence}`,
      patientName: input.patientName,
      avatarColor: avatarColors[sequence % avatarColors.length],
      date: input.date,
      dueDate: input.dueDate,
      amount: input.amount,
      status: "Pending",
      method: input.method,
      service: input.service,
    };
    set((state) => ({ invoices: [invoice, ...state.invoices] }));
    return invoice;
  },
  setStatus: (id, status) =>
    set((state) => ({
      invoices: state.invoices.map((inv) => (inv.id === id ? { ...inv, status } : inv)),
    })),
}));
