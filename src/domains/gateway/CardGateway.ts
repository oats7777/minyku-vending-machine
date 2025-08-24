export interface CardGateway {
  preAuthorize(amount: number): Promise<{ ok: boolean; authId?: string; error?: string }>;
  capture(authId: string): Promise<{ ok: boolean; error?: string }>;
  void(authId: string): Promise<{ ok: boolean; error?: string }>;
}
