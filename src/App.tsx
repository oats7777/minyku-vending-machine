import EventLog from '@/components/EventLog';
import ItemGrid from '@/components/ItemGrid';
import PaymentControls from '@/components/PaymentControls';
import { useEventLog } from '@/hooks/useEventLog';
import { useToast } from '@/hooks/useToast';
import { useVendingMachine } from '@/hooks/useVendingMachine';
import { useVendingMachineActions } from '@/hooks/useVendingMachineActions';

const App = () => {
  const { vm, items, selectedId, selected, method, setMethod, busy, setBusy, balance, sync, setSelectedId } =
    useVendingMachine();

  const { toast, showToast } = useToast();
  const { history, pushLog } = useEventLog();

  const { handleSelectItem, handleSelectMethod, handleInsertCash, handleRefund, handleCancel, handlePay } =
    useVendingMachineActions({
      vm,
      selected,
      method,
      setBusy,
      setMethod,
      setSelectedId,
      sync,
      showToast,
      pushLog,
    });

  const denominations = [100, 500, 1000, 5000, 10000];

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900 flex items-start justify-center p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <ItemGrid items={items} selectedId={selectedId} onSelect={handleSelectItem} />
          {selected && (
            <div className="bg-white rounded-2xl shadow p-4 text-sm text-gray-600">
              선택된 상품: <span className="font-medium text-gray-800">{selected.name}</span> / 가격:{' '}
              <span className="font-medium text-gray-800">{selected.price.toLocaleString()}원</span>
            </div>
          )}
        </div>

        <PaymentControls
          method={method}
          busy={busy}
          toast={toast}
          balance={balance}
          denominations={denominations}
          onSelectMethod={handleSelectMethod}
          onCancel={handleCancel}
          onInsertCash={handleInsertCash}
          onRefund={handleRefund}
          onPay={handlePay}
        />

        <EventLog history={history} />
      </div>
    </div>
  );
};

export default App;
