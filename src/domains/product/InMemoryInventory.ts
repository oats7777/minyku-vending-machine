import type { InventoryPort } from '@/domains/product/InventoryPort';
import type { NewProduct, Product, ProductPatch } from '@/domains/product/Product';

function assertNonNegInt(n: number, field: string) {
  if (!Number.isInteger(n) || n < 0) throw new Error(`${field}는 0 이상의 정수여야 합니다.`);
}

function assertNonNeg(n: number, field: string) {
  if (typeof n !== 'number' || Number.isNaN(n) || n < 0) throw new Error(`${field}는 0 이상의 숫자여야 합니다.`);
}

function slugify(name: string) {
  const lowered = name.trim().toLowerCase();
  let out = '';
  let lastDash = false;
  for (const ch of lowered) {
    const isAlpha = ch >= 'a' && ch <= 'z';
    const isDigit = ch >= '0' && ch <= '9';
    if (isAlpha || isDigit) {
      out += ch;
      lastDash = false;
    } else if (ch === ' ' || ch === '-' || ch === '_') {
      if (!lastDash) {
        out += '-';
        lastDash = true;
      }
    }
  }
  if (out.endsWith('-')) out = out.slice(0, -1);
  return out || 'item';
}

export class InMemoryInventory implements InventoryPort {
  private map = new Map<string, Product>();

  constructor(initial: NewProduct[] = []) {
    for (const p of initial) this.add(p);
  }

  list(): Product[] {
    return Array.from(this.map.values()).sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  }
  get(id: string): Product | undefined {
    return this.map.get(id);
  }
  has(id: string): boolean {
    return this.map.has(id);
  }

  add(product: NewProduct): Product {
    const id = product.id && product.id.trim() ? product.id : slugify(product.name);
    const name = product.name?.trim();
    if (!name) throw new Error('name은 필수입니다.');
    const price = product.price as number;
    const stock = product.stock as number;
    assertNonNeg(price, 'price');
    assertNonNegInt(stock, 'stock');
    if (this.map.has(id)) throw new Error(`이미 존재하는 상품 id: ${id}`);
    const item: Product = { id, name, price, stock };
    this.map.set(id, item);
    return item;
  }

  update(id: string, patch: ProductPatch): Product {
    const prev = this.map.get(id);
    if (!prev) throw new Error(`존재하지 않는 상품 id: ${id}`);
    const next: Product = { ...prev, ...patch };
    if (patch.price !== undefined) assertNonNeg(next.price, 'price');
    if (patch.stock !== undefined) assertNonNegInt(next.stock, 'stock');
    if (patch.name !== undefined && !next.name.trim()) throw new Error('name은 비울 수 없습니다.');
    this.map.set(id, next);
    return next;
  }

  remove(id: string): void {
    if (!this.map.delete(id)) throw new Error(`존재하지 않는 상품 id: ${id}`);
  }

  restock(id: string, qty: number): Product {
    assertNonNegInt(qty, 'qty');
    const it = this.getOrThrow(id);
    return this.update(id, { stock: it.stock + qty });
  }

  consume(id: string, qty: number): Product {
    assertNonNegInt(qty, 'qty');
    const it = this.getOrThrow(id);
    if (it.stock < qty) throw new Error('재고가 부족합니다.');
    return this.update(id, { stock: it.stock - qty });
  }

  searchByName(query: string): Product[] {
    const q = query.trim().toLowerCase();
    return this.list().filter((i) => i.name.toLowerCase().includes(q));
  }

  summary() {
    const items = this.list();
    const totalKinds = items.length;
    const totalUnits = items.reduce((s, i) => s + i.stock, 0);
    const inventoryValue = items.reduce((s, i) => s + i.price * i.stock, 0);
    return { totalKinds, totalUnits, inventoryValue };
  }

  private getOrThrow(id: string) {
    const it = this.map.get(id);
    if (!it) throw new Error(`존재하지 않는 상품 id: ${id}`);
    return it;
  }
}
