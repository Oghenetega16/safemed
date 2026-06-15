"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Input";
import { usePatientsStore } from "@/store/usePatientsStore";
import { useToastStore } from "@/store/useToastStore";
import type { NewPatientInput } from "@/store/usePatientsStore";

const wards = ["General Ward A", "General Ward B", "ICU", "Private Suite 1", "Private Suite 2", "Pediatric Ward", "Surgical Recovery"];
const doctors = ["Dr. Amelia Cruz", "Dr. Marcus Lee", "Dr. Priya Nair", "Dr. Daniel Osei", "Dr. Sofia Martinez", "Dr. Ethan Wallace"];

const initialForm: NewPatientInput = {
  name: "",
  age: 30,
  gender: "Female",
  condition: "",
  ward: wards[0],
  doctor: doctors[0],
  status: "Stable",
  riskLevel: "Low",
};

export function AddPatientModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState<NewPatientInput>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const addPatient = usePatientsStore((s) => s.addPatient);
  const showToast = useToastStore((s) => s.show);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.condition.trim()) {
      setError("Please fill in the patient name and condition.");
      return;
    }
    const created = addPatient(form);
    showToast({
      title: "Patient added",
      description: `${created.name} (${created.id}) has been registered.`,
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
    <Modal open={open} onClose={handleClose} title="Add New Patient" description="Register a new patient record" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full Name" required>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Priya Sharma"
              required
            />
          </Field>
          <Field label="Age" required>
            <Input
              type="number"
              min={0}
              max={120}
              value={form.age}
              onChange={(e) => setForm((f) => ({ ...f, age: Number(e.target.value) }))}
              required
            />
          </Field>
          <Field label="Gender" required>
            <Select value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value as typeof form.gender }))}>
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </Select>
          </Field>
          <Field label="Condition" required>
            <Input
              value={form.condition}
              onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value }))}
              placeholder="e.g. Hypertension"
              required
            />
          </Field>
          <Field label="Assigned Ward" required>
            <Select value={form.ward} onChange={(e) => setForm((f) => ({ ...f, ward: e.target.value }))}>
              {wards.map((w) => (
                <option key={w}>{w}</option>
              ))}
            </Select>
          </Field>
          <Field label="Attending Doctor" required>
            <Select value={form.doctor} onChange={(e) => setForm((f) => ({ ...f, doctor: e.target.value }))}>
              {doctors.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </Select>
          </Field>
          <Field label="Status" required>
            <Select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as typeof form.status }))}>
              <option>Stable</option>
              <option>Critical</option>
              <option>Recovering</option>
              <option>Discharged</option>
            </Select>
          </Field>
          <Field label="Risk Level" required>
            <Select value={form.riskLevel} onChange={(e) => setForm((f) => ({ ...f, riskLevel: e.target.value as typeof form.riskLevel }))}>
              <option>Low</option>
              <option>Moderate</option>
              <option>High</option>
            </Select>
          </Field>
        </div>

        {error && <p className="text-sm font-medium text-rose">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">Add Patient</Button>
        </div>
      </form>
    </Modal>
  );
}
