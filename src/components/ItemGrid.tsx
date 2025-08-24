import type { Product } from '@/domains/product/Product';

interface ItemGridProps {
  items: Product[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const ItemGrid = ({ items, selectedId, onSelect }: ItemGridProps) => {
  return (
    <section className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">상품 선택</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => onSelect(it.id)}
            className={
              'rounded-xl border p-4 text-left transition ' +
              (selectedId === it.id ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300')
            }
            disabled={it.stock <= 0}
          >
            <div className="text-lg font-medium">{it.name}</div>
            <div className="mt-1 text-sm">{it.price.toLocaleString()}원</div>
            <div className="mt-2 text-xs text-gray-500">재고: {it.stock}</div>
            {it.stock <= 0 && <div className="mt-2 text-xs text-red-500">품절</div>}
          </button>
        ))}
      </div>
    </section>
  );
};

export default ItemGrid;
