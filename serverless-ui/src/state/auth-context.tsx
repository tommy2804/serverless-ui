/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useEffect, useContext } from "react";
import { AxiosResponse } from "axios";
import {
  isLoggedIn as checkLoggedIn,
  getUserDetails as fetchUserDetails,
  signIn as signInAPI,
  signUp as signUpAPI,
  signOut as signOutAPI,
} from "../api/auth";

interface User {
  username: string;
  email: string;
  // Add more user properties as needed
}

interface AuthContextProps {
  currentUser: User | null;
  isLoggedIn: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const initialAuthContext: AuthContextProps = {
  currentUser: null,
  isLoggedIn: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
};

export const AuthContext = createContext<AuthContextProps>(initialAuthContext);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    checkLoggedInStatus();
  }, []);

  const checkLoggedInStatus = async () => {
    try {
      const response = await checkLoggedIn();
      setIsLoggedIn(response.data.isLoggedIn);
      if (response.data.isLoggedIn) {
        const userDetails = await fetchUserDetails();
        setCurrentUser(userDetails.data); // Assuming your getUserDetails returns user data
      }
    } catch (error) {
      console.error("Error checking logged in status:", error);
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      const response = await signInAPI(username, password);
      setIsLoggedIn(true);
      setCurrentUser(response.data.user);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const signUp = async (username: string, email: string, password: string) => {
    try {
      await signUpAPI(username, email, password);
      // After signing up, you might want to automatically sign in the user
      await signIn(username, password);
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const signOut = async () => {
    try {
      await signOutAPI();
      setIsLoggedIn(false);
      setCurrentUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoggedIn, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
