interface CashPanelProps {
  balance: number;
  denominations: number[];
  disabled?: boolean;
  onInsert: (denomination: number) => void;
  onRefund: () => void;
}

const CashPanel = ({ balance, denominations, disabled, onInsert, onRefund }: CashPanelProps) => {
  return (
    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-emerald-900">현금 투입</div>
        <button
          className="px-3 py-1.5 text-xs rounded-full border border-emerald-300 bg-white hover:border-emerald-400 disabled:opacity-50"
          onClick={onRefund}
          disabled={disabled || balance <= 0}
          title="잔액 반환"
        >
          잔액 반환
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {denominations.map((d) => (
          <button
            key={d}
            className="px-3 py-2 rounded-lg text-sm border border-emerald-300 bg-white hover:border-emerald-400"
            onClick={() => onInsert(d)}
            disabled={disabled}
          >
            {d.toLocaleString()}원
          </button>
        ))}
      </div>
      <div className="text-sm text-emerald-900">
        누적 금액: <span className="font-semibold">{balance.toLocaleString()}원</span>
      </div>
    </div>
  );
};

export default CashPanel;
