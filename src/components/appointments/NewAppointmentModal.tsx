"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Input";
import { doctorOptions, departmentOptions, appointmentTypeOptions } from "@/data/appointments";
import { useAppointmentsStore } from "@/store/useAppointmentsStore";
import { useToastStore } from "@/store/useToastStore";
import type { NewAppointmentInput } from "@/store/useAppointmentsStore";

const durationOptions = ["15 min", "20 min", "30 min", "45 min", "60 min", "90 min", "180 min"];

const initialForm: NewAppointmentInput = {
  patientName: "",
  doctor: doctorOptions[0],
  department: departmentOptions[0],
  type: appointmentTypeOptions[0],
  date: "2025-02-20",
  time: "09:00 AM",
  duration: "30 min",
};

export function NewAppointmentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState<NewAppointmentInput>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const addAppointment = useAppointmentsStore((s) => s.addAppointment);
  const showToast = useToastStore((s) => s.show);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientName.trim()) {
      setError("Please enter a patient name.");
      return;
    }
    const created = addAppointment(form);
    showToast({
      title: "Appointment scheduled",
      description: `${created.patientName} with ${created.doctor} on ${created.date} at ${created.time}.`,
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
    <Modal open={open} onClose={handleClose} title="New Appointment" description="Schedule a new patient appointment" size="lg">
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
          <Field label="Doctor" required>
            <Select value={form.doctor} onChange={(e) => setForm((f) => ({ ...f, doctor: e.target.value }))}>
              {doctorOptions.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </Select>
          </Field>
          <Field label="Department" required>
            <Select value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}>
              {departmentOptions.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </Select>
          </Field>
          <Field label="Appointment Type" required>
            <Select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
              {appointmentTypeOptions.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </Select>
          </Field>
          <Field label="Duration" required>
            <Select value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}>
              {durationOptions.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </Select>
          </Field>
          <Field label="Date" required>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              required
            />
          </Field>
          <Field label="Time" required hint="e.g. 09:00 AM">
            <Input
              value={form.time}
              onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              placeholder="09:00 AM"
              required
            />
          </Field>
        </div>

        {error && <p className="text-sm font-medium text-rose">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">Schedule Appointment</Button>
        </div>
      </form>
    </Modal>
  );
}
