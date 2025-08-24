import type { NewProduct, Product, ProductPatch } from '@/domains/product/Product';

export interface InventoryPort {
  list(): Product[];
  get(id: string): Product | undefined;
  has(id: string): boolean;

  add(product: NewProduct): Product;
  update(id: string, patch: ProductPatch): Product;
  remove(id: string): void;

  /* 재고 증가 */
  restock(id: string, qty: number): Product;
  /* 재고 감소 */
  consume(id: string, qty: number): Product;

  summary(): { totalKinds: number; totalUnits: number; inventoryValue: number };
}
