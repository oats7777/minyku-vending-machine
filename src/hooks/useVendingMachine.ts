import { useMemo, useRef, useState } from 'react';

import { seedProducts } from '@/data/products';
import { VendingMachineCore } from '@/domains/VendingMachineCore';
import { MockGateway } from '@/domains/gateway/MockGateway';
import type { PaymentType } from '@/domains/payment/PaymentMethod';
import type { Product } from '@/domains/product/Product';

export const useVendingMachine = () => {
  const vm = useRef(new VendingMachineCore({ cardGateway: MockGateway }, seedProducts));

  const [items, setItems] = useState<Product[]>(() => vm.current.listProducts());

  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id ?? null);

  const selected = useMemo(() => items.find((i) => i.id === selectedId) ?? null, [items, selectedId]);

  const [method, setMethod] = useState<PaymentType | null>(null);
  const [busy, setBusy] = useState(false);

  const sync = () => setItems(vm.current.listProducts());
  const balance = vm.current.getBalance();

  return {
    vm: vm.current,
    items,
    selectedId,
    selected,
    method,
    setMethod,
    busy,
    setBusy,
    balance,
    sync,
    setSelectedId,
  };
};
