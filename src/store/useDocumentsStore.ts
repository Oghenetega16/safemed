import { create } from "zustand";
import { medicalDocuments } from "@/data/documents";
import type { MedicalDocument, DocumentType, FileKind } from "@/types";

export interface NewDocumentInput {
  name: string;
  patientName: string;
  type: DocumentType;
  doctor: string;
  fileKind: FileKind;
}

interface DocumentsState {
  documents: MedicalDocument[];
  addDocument: (input: NewDocumentInput) => MedicalDocument;
}

const sizesByKind: Record<FileKind, string[]> = {
  pdf: ["210 KB", "340 KB", "1.1 MB", "2.4 MB"],
  image: ["3.2 MB", "4.8 MB", "6.1 MB"],
  doc: ["96 KB", "180 KB", "412 KB"],
};

export const useDocumentsStore = create<DocumentsState>((set, get) => ({
  documents: medicalDocuments,
  addDocument: (input) => {
    const sequence = get().documents.length + 1;
    const sizes = sizesByKind[input.fileKind];
    const doc: MedicalDocument = {
      id: `DOC-${4000 + sequence}`,
      name: input.name,
      patientName: input.patientName,
      type: input.type,
      date: new Date().toISOString().slice(0, 10),
      size: sizes[sequence % sizes.length],
      fileKind: input.fileKind,
      doctor: input.doctor,
    };
    set((state) => ({ documents: [doc, ...state.documents] }));
    return doc;
  },
}));
