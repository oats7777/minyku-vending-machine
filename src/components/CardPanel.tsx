const CardPanel = () => {
  return (
    <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 space-y-2">
      <div className="text-sm font-medium text-blue-900">카드 단말기</div>
      <p className="text-sm text-blue-900/80">결제 버튼을 누르면 승인 → 매입 과정을 시뮬레이션합니다.</p>
    </div>
  );
};

export default CardPanel;
