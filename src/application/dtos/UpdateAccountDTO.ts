// The owning userId is NOT part of this DTO: it always comes from the
// authenticated token, never from client input.
export interface UpdateAccountDTO {
  name?: string;
  type?: 'CHECKING' | 'SAVINGS' | 'CREDIT' | 'INVESTMENT';
}
