import type { Role } from '../constants/roles';

export interface UserRecord {
  email: string;
  name: string;
  picture: string;
  role: Role;
  addedAt: string;
}
