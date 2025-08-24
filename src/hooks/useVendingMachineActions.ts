import type { VendingMachineCore } from '@/domains/VendingMachineCore';
import type { PaymentType } from '@/domains/payment/PaymentMethod';
import type { Product } from '@/domains/product/Product';

interface UseVendingMachineActionsProps {
  vm: VendingMachineCore;
  selected: Product | null;
  method: PaymentType | null;
  setBusy: (busy: boolean) => void;
  setMethod: (method: PaymentType | null) => void;
  setSelectedId: (id: string | null) => void;
  sync: () => void;
  showToast: (message: string) => void;
  pushLog: (message: string) => void;
}

export const useVendingMachineActions = ({
  vm,
  selected,
  method,
  setBusy,
  setMethod,
  setSelectedId,
  sync,
  showToast,
  pushLog,
}: UseVendingMachineActionsProps) => {
  const handleSelectItem = (id: string) => {
    try {
      vm.selectProduct(id);
      setSelectedId(id);
    } catch (e: any) {
      showToast(e.message ?? '상품 선택 오류');
    }
  };

  const handleSelectMethod = async (t: PaymentType) => {
    try {
      setBusy(true);
      await vm.selectPaymentMethod(t);
      setMethod(vm.currentType);
      pushLog(`결제수단 선택: ${t === 'cash' ? '현금' : '카드'}`);
    } catch (e: any) {
      showToast(e.message ?? '결제수단 선택 오류');
    } finally {
      setBusy(false);
    }
  };

  const handleInsertCash = (denomination: number) => {
    try {
      vm.insertCash(denomination);
      pushLog(`${denomination.toLocaleString()}원 투입 (누적: ${vm.getBalance().toLocaleString()}원)`);
    } catch (e: any) {
      showToast(e.message ?? '현금 투입 오류');
    }
  };

  const handleRefund = async () => {
    try {
      setBusy(true);
      const refunded = await vm.returnChange();
      pushLog(`잔액 반환: ${refunded.toLocaleString()}원`);
      showToast(refunded > 0 ? `잔액 ${refunded.toLocaleString()}원을 반환했습니다` : '반환할 잔액이 없습니다');
    } catch (e: any) {
      showToast(e.message ?? '잔액 반환 오류');
    } finally {
      setBusy(false);
    }
  };

  const handleCancel = async () => {
    await vm.cancel();
    pushLog('거래 취소 (세션 취소, 잔액 유지)');
  };

  const handlePay = async () => {
    if (!selected) return showToast('상품을 선택해주세요');
    try {
      setBusy(true);
      const res = await vm.purchaseSelected();
      if (!res.ok) {
        showToast(res.error ?? '결제 실패');
        pushLog(`결제 실패: ${res.error ?? '알 수 없음'}`);
        return;
      }
      sync();
      if (method === 'cash') {
        const remain = vm.getBalance();
        showToast(`결제 완료! 현재 잔액: ${remain.toLocaleString()}원 (잔액은 '잔액 반환' 전까지 유지됩니다)`);
        pushLog(`결제 성공 (현금). 현재 잔액: ${remain.toLocaleString()}원`);
      } else {
        showToast('결제 완료! (카드)');
        pushLog('결제 성공 (카드)');
      }
    } catch (e: any) {
      showToast(e.message ?? '결제 처리 오류');
    } finally {
      setBusy(false);
    }
  };

  return {
    handleSelectItem,
    handleSelectMethod,
    handleInsertCash,
    handleRefund,
    handleCancel,
    handlePay,
  };
};
