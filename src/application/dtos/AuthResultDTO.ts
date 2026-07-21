export interface AuthResultDTO {
  token: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}
