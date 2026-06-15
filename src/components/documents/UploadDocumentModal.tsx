"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Input";
import { documentTypes } from "@/data/documents";
import { doctorOptions } from "@/data/appointments";
import { useDocumentsStore } from "@/store/useDocumentsStore";
import { useToastStore } from "@/store/useToastStore";
import type { NewDocumentInput } from "@/store/useDocumentsStore";

const fileKindOptions: NewDocumentInput["fileKind"][] = ["pdf", "image", "doc"];

const initialForm: NewDocumentInput = {
  name: "",
  patientName: "",
  type: documentTypes[0],
  doctor: doctorOptions[0],
  fileKind: "pdf",
};

export function UploadDocumentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState<NewDocumentInput>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const addDocument = useDocumentsStore((s) => s.addDocument);
  const showToast = useToastStore((s) => s.show);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.patientName.trim()) {
      setError("Please provide a document name and patient.");
      return;
    }
    const created = addDocument(form);
    showToast({ title: "Document uploaded", description: `${created.name} added to ${created.patientName}'s records.`, tone: "success" });
    setForm(initialForm);
    setError(null);
    onClose();
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Upload Document" description="Add a new file to a patient's medical record" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Document Name" required className="sm:col-span-2">
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. MRI Brain Scan" required />
          </Field>
          <Field label="Patient Name" required>
            <Input value={form.patientName} onChange={(e) => setForm((f) => ({ ...f, patientName: e.target.value }))} placeholder="e.g. Jordan Rivers" required />
          </Field>
          <Field label="Document Type" required>
            <Select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as typeof form.type }))}>
              {documentTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </Select>
          </Field>
          <Field label="Issuing Doctor" required>
            <Select value={form.doctor} onChange={(e) => setForm((f) => ({ ...f, doctor: e.target.value }))}>
              {doctorOptions.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </Select>
          </Field>
          <Field label="File Type" required hint="Used to pick a preview icon">
            <Select value={form.fileKind} onChange={(e) => setForm((f) => ({ ...f, fileKind: e.target.value as typeof form.fileKind }))}>
              {fileKindOptions.map((k) => (
                <option key={k} value={k}>
                  {k.toUpperCase()}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        {error && <p className="text-sm font-medium text-rose">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">Upload</Button>
        </div>
      </form>
    </Modal>
  );
}
