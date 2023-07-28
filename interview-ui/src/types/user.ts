import { ROLE } from './role';

export interface User {
  id: string;
  user: string;
  firstName: string;
  lastName: string;
  email: string;
  role: ROLE;
}
