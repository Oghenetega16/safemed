import type { InventoryItem, InventoryStatus } from "@/types";

export const inventoryItems: InventoryItem[] = [
  { id: "ITM-001", name: "Paracetamol 500mg", category: "Medication", sku: "MED-001", stock: 1200, reorderLevel: 300, unit: "tablets", supplier: "PharmaCorp", lastRestocked: "2025-02-10" },
  { id: "ITM-002", name: "Amoxicillin 250mg", category: "Medication", sku: "MED-002", stock: 80, reorderLevel: 150, unit: "capsules", supplier: "PharmaCorp", lastRestocked: "2025-02-08" },
  { id: "ITM-003", name: "Insulin Glargine", category: "Medication", sku: "MED-003", stock: 45, reorderLevel: 50, unit: "vials", supplier: "MedSupply Co", lastRestocked: "2025-02-05" },
  { id: "ITM-004", name: "Surgical Gloves (M)", category: "PPE", sku: "PPE-001", stock: 4500, reorderLevel: 1000, unit: "pairs", supplier: "SafeGuard Inc", lastRestocked: "2025-02-12" },
  { id: "ITM-005", name: "N95 Respirator Masks", category: "PPE", sku: "PPE-002", stock: 200, reorderLevel: 500, unit: "masks", supplier: "SafeGuard Inc", lastRestocked: "2025-02-01" },
  { id: "ITM-006", name: "IV Cannula 18G", category: "Medical Supplies", sku: "SUP-001", stock: 850, reorderLevel: 200, unit: "units", supplier: "MedSupply Co", lastRestocked: "2025-02-11" },
  { id: "ITM-007", name: "Saline Solution 0.9% 1L", category: "Medical Supplies", sku: "SUP-002", stock: 320, reorderLevel: 100, unit: "bags", supplier: "MedSupply Co", lastRestocked: "2025-02-09" },
  { id: "ITM-008", name: "Syringes 5ml", category: "Medical Supplies", sku: "SUP-003", stock: 0, reorderLevel: 500, unit: "units", supplier: "SafeGuard Inc", lastRestocked: "2025-01-28" },
  { id: "ITM-009", name: "Gauze Pads", category: "Medical Supplies", sku: "SUP-004", stock: 1800, reorderLevel: 400, unit: "packs", supplier: "SafeGuard Inc", lastRestocked: "2025-02-13" },
  { id: "ITM-010", name: "Blood Glucose Test Strips", category: "Lab Supplies", sku: "LAB-001", stock: 600, reorderLevel: 200, unit: "strips", supplier: "DiagnoLab", lastRestocked: "2025-02-07" },
  { id: "ITM-011", name: "CBC Reagent Kit", category: "Lab Supplies", sku: "LAB-002", stock: 12, reorderLevel: 15, unit: "kits", supplier: "DiagnoLab", lastRestocked: "2025-02-03" },
  { id: "ITM-012", name: "Portable ECG Machine", category: "Equipment", sku: "EQP-001", stock: 6, reorderLevel: 2, unit: "units", supplier: "MedTech Solutions", lastRestocked: "2025-01-15" },
  { id: "ITM-013", name: "Infusion Pump", category: "Equipment", sku: "EQP-002", stock: 3, reorderLevel: 2, unit: "units", supplier: "MedTech Solutions", lastRestocked: "2025-01-20" },
  { id: "ITM-014", name: "Oxygen Cylinders (Large)", category: "Equipment", sku: "EQP-003", stock: 14, reorderLevel: 10, unit: "units", supplier: "GasMed Supplies", lastRestocked: "2025-02-06" },
  { id: "ITM-015", name: "Lisinopril 10mg", category: "Medication", sku: "MED-004", stock: 540, reorderLevel: 150, unit: "tablets", supplier: "PharmaCorp", lastRestocked: "2025-02-10" },
  { id: "ITM-016", name: "Albuterol Inhalers", category: "Medication", sku: "MED-005", stock: 0, reorderLevel: 50, unit: "units", supplier: "PharmaCorp", lastRestocked: "2025-01-30" },
];

export const inventoryCategories = ["Medication", "PPE", "Medical Supplies", "Lab Supplies", "Equipment"];

export const inventorySuppliers = ["PharmaCorp", "MedSupply Co", "SafeGuard Inc", "DiagnoLab", "MedTech Solutions", "GasMed Supplies"];

export function getInventoryStatus(item: { stock: number; reorderLevel: number }): InventoryStatus {
  if (item.stock <= 0) return "Out of Stock";
  if (item.stock <= item.reorderLevel) return "Low Stock";
  return "In Stock";
}

export function getStockPercent(item: { stock: number; reorderLevel: number }): number {
  const reference = Math.max(item.reorderLevel * 2, 1);
  return Math.min(100, Math.round((item.stock / reference) * 100));
}
