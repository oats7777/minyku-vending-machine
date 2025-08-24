import type { PaymentType } from '@/domains/payment/PaymentMethod';

interface MethodButtonsProps {
  method: PaymentType | null;
  disabled?: boolean;
  onSelect: (type: PaymentType) => void;
  onCancel: () => void;
}

const PaymentMethodButtons = ({ method, disabled, onSelect, onCancel }: MethodButtonsProps) => {
  return (
    <div className="flex gap-2">
      <button
        className={
          'px-4 py-2 rounded-full text-sm border transition ' +
          (method === 'card'
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-800 border-gray-300 hover:border-gray-400')
        }
        onClick={() => onSelect('card')}
        disabled={disabled}
      >
        카드
      </button>
      <button
        className={
          'px-4 py-2 rounded-full text-sm border transition ' +
          (method === 'cash'
            ? 'bg-emerald-600 text-white border-emerald-600'
            : 'bg-white text-gray-800 border-gray-300 hover:border-gray-400')
        }
        onClick={() => onSelect('cash')}
        disabled={disabled}
      >
        현금
      </button>
      <button
        className="ml-auto px-3 py-2 rounded-full text-sm border border-gray-300 hover:border-gray-400"
        onClick={onCancel}
        disabled={disabled || method === null}
      >
        취소
      </button>
    </div>
  );
};

export default PaymentMethodButtons;
