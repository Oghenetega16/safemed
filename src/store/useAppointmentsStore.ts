import { create } from "zustand";
import { appointmentRecords } from "@/data/appointments";
import type { AppointmentRecord, AppointmentStatus } from "@/types";

const avatarColors = ["#3E6BFF", "#FF6B81", "#1FCB8F", "#FFB648", "#8C6CFF", "#3EA8FF", "#FF9F6B", "#3EE0D1"];

export interface NewAppointmentInput {
  patientName: string;
  doctor: string;
  department: string;
  type: string;
  date: string;
  time: string;
  duration: string;
}

interface AppointmentsState {
  appointments: AppointmentRecord[];
  addAppointment: (input: NewAppointmentInput) => AppointmentRecord;
  setStatus: (id: string, status: AppointmentStatus) => void;
}

export const useAppointmentsStore = create<AppointmentsState>((set, get) => ({
  appointments: appointmentRecords,
  addAppointment: (input) => {
    const sequence = get().appointments.length + 2001;
    const record: AppointmentRecord = {
      id: `AP-${2000 + sequence}`,
      patientName: input.patientName,
      avatarColor: avatarColors[sequence % avatarColors.length],
      doctor: input.doctor,
      department: input.department,
      type: input.type,
      date: input.date,
      time: input.time,
      duration: input.duration,
      status: "pending",
    };
    set((state) => ({ appointments: [record, ...state.appointments] }));
    return record;
  },
  setStatus: (id, status) =>
    set((state) => ({
      appointments: state.appointments.map((a) => (a.id === id ? { ...a, status } : a)),
    })),
}));
