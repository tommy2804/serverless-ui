import { ROLE } from './role';

export interface User {
  id: string;
  user: string;
  firstName: string;
  lastName: string;
  email: string;
  role: ROLE;
}

export interface AxiosResUser {
  user: User;
  token: string;
}

export interface CurrentUser {
  currentUser: {
    id: string;
    user: string;
    firstName: string;
    lastName: string;
    email: string;
    role: ROLE;
  };
}
