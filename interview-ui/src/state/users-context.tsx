import React, { createContext, useState, useEffect, useCallback } from 'react';
import { SignUpUser } from '../types/auth';
import { deleteUser, createUser, editUser, getUsers } from '../api/users';
import { User } from '../types/user';

interface editUser {
  email: string;
  firstName: string;
  lastName: string;
}

interface UserContextProps {
  users: User[] | null;
  onEditUser: (id: string, newData: editUser) => void;
  onDeleteUser: (id: string) => void;
  onCreateUser: (newUser: SignUpUser) => void;
}

interface UsersProviderProps {
  children: React.ReactNode;
}

export const UserContext = createContext<UserContextProps>({
  users: [],
  onEditUser: () => {},
  onDeleteUser: () => {},
  onCreateUser: () => {},
});

export const UsersProvider: React.FC<UsersProviderProps> = ({ children }) => {
  // USERS STATE
  const [users, setUsers] = useState<User[] | null>([]);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, []);

  // Create a new user
  const onCreateUser = async (newUser: SignUpUser) => {
    try {
      const { email, firstName, lastName, password } = newUser;
      const { data } = await createUser(email, password, lastName, firstName);
      setUsers((prevUsers) => (prevUsers ? [...prevUsers, data] : [data]));
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  // Delete a user
  const onDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      setUsers((prevUsers) => prevUsers?.filter((user) => user.id !== id) || null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Edit a user
  const onEditUser = async (id: string, newData: SignUpUser) => {
    try {
      const { email, firstName, lastName } = newData;
      const { data } = await editUser(email, firstName, lastName, id);
      setUsers(
        (prevUsers) =>
          prevUsers?.map((user) => (user.id === id ? { ...user, ...data } : user)) || null
      );
    } catch (error) {
      console.error('Error editing user:', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        onEditUser,
        onDeleteUser,
        onCreateUser,
      }}>
      {children}
    </UserContext.Provider>
  );
};
