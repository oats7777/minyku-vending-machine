export interface Product {
  /* 상품 식별자(slug/uuid) */
  id: string;
  /* 표시명 */
  name: string;
  /* 가격(KRW 정수) */
  price: number;
  /* 재고(정수, 0 이상) */
  stock: number;
}

export type ProductPatch = Partial<Omit<Product, 'id'>>;
export type NewProduct = Omit<Product, 'id'> & { id?: string };
