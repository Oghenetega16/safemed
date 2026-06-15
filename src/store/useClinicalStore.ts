import { create } from "zustand";
import { staffMembers, operationSchedule } from "@/data/clinical";
import type { StaffMember, StaffStatus, OperationSchedule, OperationStatus } from "@/types";

const statusCycle: Record<StaffStatus, StaffStatus> = {
  "On Duty": "On Break",
  "On Break": "Off Duty",
  "Off Duty": "On Duty",
};

interface ClinicalState {
  staff: StaffMember[];
  operations: OperationSchedule[];
  cycleStaffStatus: (id: string) => StaffMember | undefined;
  setOperationStatus: (id: string, status: OperationStatus) => void;
}

export const useClinicalStore = create<ClinicalState>((set, get) => ({
  staff: staffMembers,
  operations: operationSchedule,
  cycleStaffStatus: (id) => {
    let updated: StaffMember | undefined;
    set((state) => ({
      staff: state.staff.map((member) => {
        if (member.id !== id) return member;
        updated = { ...member, status: statusCycle[member.status] };
        return updated;
      }),
    }));
    return updated;
  },
  setOperationStatus: (id, status) =>
    set((state) => ({
      operations: state.operations.map((op) => (op.id === id ? { ...op, status } : op)),
    })),
}));
