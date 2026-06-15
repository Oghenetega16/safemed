import { create } from "zustand";
import { inventoryItems } from "@/data/inventory";
import type { InventoryItem } from "@/types";

export interface NewInventoryItemInput {
  name: string;
  category: string;
  stock: number;
  reorderLevel: number;
  unit: string;
  supplier: string;
}

interface InventoryState {
  items: InventoryItem[];
  addItem: (input: NewInventoryItemInput) => InventoryItem;
  restock: (id: string, quantity: number) => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: inventoryItems,
  addItem: (input) => {
    const sequence = get().items.length + 1;
    const prefix = input.category.slice(0, 3).toUpperCase();
    const item: InventoryItem = {
      id: `ITM-${String(100 + sequence).padStart(3, "0")}`,
      name: input.name,
      category: input.category,
      sku: `${prefix}-${String(100 + sequence).slice(-3)}`,
      stock: input.stock,
      reorderLevel: input.reorderLevel,
      unit: input.unit,
      supplier: input.supplier,
      lastRestocked: new Date().toISOString().slice(0, 10),
    };
    set((state) => ({ items: [item, ...state.items] }));
    return item;
  },
  restock: (id, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? { ...item, stock: item.stock + quantity, lastRestocked: new Date().toISOString().slice(0, 10) }
          : item
      ),
    })),
}));
