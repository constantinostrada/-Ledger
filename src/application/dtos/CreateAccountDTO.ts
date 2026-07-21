// The owning userId is NOT part of this DTO: it always comes from the
// authenticated token, never from client input.
export interface CreateAccountDTO {
  name: string;
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT' | 'INVESTMENT';
  /** Integer cents — floats are rejected by the domain. */
  initialBalanceCents?: number;
  currency?: string;
}
