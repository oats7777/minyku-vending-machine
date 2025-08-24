import type { CardGateway } from '@/domains/gateway/CardGateway';
import { CardPayment } from '@/domains/payment/CardPayment';
import { CashPayment } from '@/domains/payment/CashPayment';
import type { PaymentMethod, PaymentType } from '@/domains/payment/PaymentMethod';
import { InMemoryInventory } from '@/domains/product/InMemoryInventory';
import type { InventoryPort } from '@/domains/product/InventoryPort';
import type { NewProduct, Product, ProductPatch } from '@/domains/product/Product';

export class VendingMachineCore {
  private payment: PaymentMethod | null = null;
  private inventory: InventoryPort;
  private selectedId: string | null = null;
  private processing = false;

  constructor(
    private readonly deps?: {
      cardGateway?: CardGateway;
      inventory?: InventoryPort;
    },
    initialProducts: NewProduct[] = []
  ) {
    this.inventory = deps?.inventory ?? new InMemoryInventory(initialProducts);
  }
  get currentType(): PaymentType | null {
    return this.payment?.type ?? null;
  }

  async selectPaymentMethod(type: PaymentType) {
    if (this.payment && this.payment.type === 'cash' && type !== 'cash' && this.payment.getBalance() > 0) {
      throw new Error("잔액이 남아 있습니다. '잔액 반환' 후 결제수단을 변경해주세요.");
    }

    if (this.payment) await this.payment.cancel();

    if (type === 'card') {
      if (!this.deps?.cardGateway) throw new Error('CardGateway 미설정');
      this.payment = new CardPayment(this.deps.cardGateway);
    } else {
      this.payment = new CashPayment();
    }

    await this.payment.start();
  }

  // 현금 투입
  insertCash(denomination: number) {
    if (!this.payment) throw new Error('결제 수단이 선택되지 않았습니다.');
    if (this.payment.type !== 'cash') throw new Error('현금 결제가 아닙니다.');
    this.payment.insert!(denomination);
  }
  getBalance() {
    return this.payment?.getBalance() ?? 0;
  }
  async pay(amount: number) {
    if (!this.payment) throw new Error('결제 수단이 선택되지 않았습니다.');
    return this.payment.pay(amount);
  }

  // 취소: 현금은 잔액 유지(자동 환불 없음)
  async cancel() {
    if (this.payment) await this.payment.cancel();
    this.processing = false;
  }

  async returnChange() {
    if (!this.payment?.refund) return 0;
    const refunded = await this.payment.refund();
    return refunded;
  }
  listProducts(): Product[] {
    return this.inventory.list();
  }
  getProduct(id: string): Product | undefined {
    return this.inventory.get(id);
  }
  hasProduct(id: string): boolean {
    return this.inventory.has(id);
  }

  addProduct(p: NewProduct): Product {
    return this.inventory.add(p);
  }
  updateProduct(id: string, patch: ProductPatch): Product {
    return this.inventory.update(id, patch);
  }
  removeProduct(id: string): void {
    return this.inventory.remove(id);
  }
  restockProduct(id: string, qty: number): Product {
    return this.inventory.restock(id, qty);
  }
  consumeProduct(id: string, qty: number): Product {
    return this.inventory.consume(id, qty);
  }

  selectProduct(id: string) {
    const it = this.inventory.get(id);
    if (!it) throw new Error('존재하지 않는 상품입니다.');
    if (it.stock <= 0) throw new Error('품절 상품입니다.');
    this.selectedId = id;
  }

  clearSelectedProduct() {
    this.selectedId = null;
  }

  getSelectedProduct(): Product | null {
    return this.selectedId ? (this.inventory.get(this.selectedId) ?? null) : null;
  }

  async purchaseSelected() {
    if (this.processing) throw new Error('이전 작업 처리 중입니다.');
    const item = this.getSelectedProduct();
    if (!item) throw new Error('상품이 선택되지 않았습니다.');
    if (!this.payment) throw new Error('결제 수단이 선택되지 않았습니다.');

    try {
      this.processing = true;
      const res = await this.payment.pay(item.price);
      if (!res.ok) return { ok: false as const, error: res.error };
      this.inventory.consume(item.id, 1);
      const updated = this.inventory.get(item.id)!;
      return { ok: true as const, change: res.change, item: updated };
    } finally {
      this.processing = false;
    }
  }
}
