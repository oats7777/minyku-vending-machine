import { sleep } from '@/utils/async';

import type { CardGateway } from './CardGateway';

export const MockGateway: CardGateway = {
  async preAuthorize(amount) {
    await sleep(400);
    if (amount > 10000) return { ok: false, error: '한도 초과 또는 승인 거절' };
    return { ok: true, authId: `auth_${Date.now()}` };
  },
  async capture() {
    await sleep(300);
    return { ok: true };
  },
  async void() {
    await sleep(150);
    return { ok: true };
  },
};
