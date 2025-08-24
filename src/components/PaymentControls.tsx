import CardPanel from '@/components/CardPanel';
import CashPanel from '@/components/CashPanel';
import PayButton from '@/components/PayButton';
import PaymentMethodButtons from '@/components/PaymentMethodButtons';
import type { PaymentType } from '@/domains/payment/PaymentMethod';

interface PaymentControlsProps {
  method: PaymentType | null;
  busy: boolean;
  toast: string | null;
  balance: number;
  denominations: number[];
  onSelectMethod: (t: PaymentType) => Promise<void> | void;
  onCancel: () => Promise<void> | void;
  onInsertCash: (d: number) => void;
  onRefund: () => Promise<void> | void;
  onPay: () => Promise<void> | void;
}

const PaymentControls = ({
  method,
  busy,
  toast,
  balance,
  denominations,
  onSelectMethod,
  onCancel,
  onInsertCash,
  onRefund,
  onPay,
}: PaymentControlsProps) => {
  return (
    <section className="bg-white rounded-2xl shadow p-6 space-y-4">
      <h2 className="text-xl font-semibold">결제</h2>

      <PaymentMethodButtons method={method} disabled={busy} onSelect={onSelectMethod} onCancel={onCancel} />

      {method === 'cash' && (
        <CashPanel
          balance={balance}
          denominations={denominations}
          disabled={busy}
          onInsert={onInsertCash}
          onRefund={onRefund}
        />
      )}

      {method === 'card' && <CardPanel />}

      <PayButton
        busy={busy}
        method={method}
        label={method ? '결제' : '결제수단을 선택해주세요'}
        onPay={onPay as any}
        disabled={!method}
      />

      {toast && (
        <div className="text-sm rounded-lg border p-3" role="status">
          {toast}
        </div>
      )}
    </section>
  );
};

export default PaymentControls;
