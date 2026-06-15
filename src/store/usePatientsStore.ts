import { create } from "zustand";
import { patients as initialPatients } from "@/data/patients";
import type { Patient, PatientStatus, RiskLevel } from "@/types";

const avatarColors = ["#3E6BFF", "#FF6B81", "#1FCB8F", "#FFB648", "#8C6CFF", "#3EA8FF", "#FF9F6B", "#3EE0D1"];

export interface NewPatientInput {
  name: string;
  age: number;
  gender: Patient["gender"];
  condition: string;
  ward: string;
  doctor: string;
  status: PatientStatus;
  riskLevel: RiskLevel;
}

interface PatientsState {
  patients: Patient[];
  addPatient: (input: NewPatientInput) => Patient;
  updateStatus: (id: string, status: PatientStatus) => void;
}

export const usePatientsStore = create<PatientsState>((set, get) => ({
  patients: initialPatients,
  addPatient: (input) => {
    const sequence = get().patients.length + 1001;
    const today = new Date().toISOString().slice(0, 10);
    const newPatient: Patient = {
      id: `PT-${1000 + sequence}`,
      name: input.name,
      age: input.age,
      gender: input.gender,
      avatarColor: avatarColors[sequence % avatarColors.length],
      condition: input.condition,
      status: input.status,
      riskLevel: input.riskLevel,
      ward: input.ward,
      doctor: input.doctor,
      phone: "—",
      email: "—",
      bloodType: "—",
      admissionDate: today,
      lastVisit: today,
      vitals: [
        { label: "Heart Rate", value: "—", status: "normal" },
        { label: "Blood Pressure", value: "—", status: "normal" },
        { label: "Temperature", value: "—", status: "normal" },
        { label: "SpO₂", value: "—", status: "normal" },
      ],
      history: [{ date: today, title: "Admitted", description: `Registered with condition: ${input.condition}.` }],
      vitalsTrend: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
        day,
        heartRate: 76,
        spo2: 97,
      })),
    };
    set((state) => ({ patients: [newPatient, ...state.patients] }));
    return newPatient;
  },
  updateStatus: (id, status) =>
    set((state) => ({
      patients: state.patients.map((p) => (p.id === id ? { ...p, status } : p)),
    })),
}));
