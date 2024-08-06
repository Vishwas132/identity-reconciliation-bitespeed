export interface Contact {
  id: number;
  email: string | null;
  phoneNumber: string | null;
  linkedId: number | null;
  linkPrecedence: string | null;
  createdAt: Date;
  updatedAt: Date;
}
