import type { NewProduct } from '@/domains/product/Product';

export const seedProducts: NewProduct[] = [
  { id: 'cola', name: '콜라', price: 1100, stock: 10 },
  { id: 'water', name: '물', price: 600, stock: 10 },
  { id: 'coffee', name: '커피', price: 700, stock: 10 },
];
