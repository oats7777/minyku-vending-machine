import type { PaymentType } from '@/domains/payment/PaymentMethod';

interface PayButtonProps {
  busy: boolean;
  method: PaymentType | null;
  label: string;
  onPay: () => void;
  disabled?: boolean;
}

const PayButton = ({ busy, method, label, onPay, disabled }: PayButtonProps) => {
  const className =
    'w-full py-3 rounded-xl text-white font-semibold shadow transition ' +
    (busy
      ? 'bg-gray-400'
      : method === 'cash'
        ? 'bg-emerald-600 hover:bg-emerald-700'
        : method === 'card'
          ? 'bg-blue-600 hover:bg-blue-700'
          : 'bg-gray-400');
  return (
    <button onClick={onPay} disabled={busy || disabled} className={className}>
      {busy ? '처리 중...' : label}
    </button>
  );
};

export default PayButton;
