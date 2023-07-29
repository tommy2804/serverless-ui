import { useState, useEffect } from 'react';
import { isLoggedIn } from '../api/auth';
import { User } from '../types/user';

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      const {
        data: { currentUser },
      } = await isLoggedIn();

      setCurrentUser(currentUser);
    };
    checkIfLoggedIn();
  }, []);

  return currentUser;
};
