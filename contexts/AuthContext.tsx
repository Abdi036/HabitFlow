

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Models } from 'react-native-appwrite';
import { account, ID } from '../lib/appwrite';


interface AuthContextType {
  user: Models.User<Models.Preferences> | null; 
  loading: boolean; 
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ error: any }>;
  updateName: (name: string) => Promise<{ error: any }>;
}

 
const AuthContext = createContext<AuthContextType | undefined>(undefined);

 
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);   
  const [loading, setLoading] = useState(true);

   
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
     
      await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);

      const currentUser = await account.get();
      setUser(currentUser);
      
      return { error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { error };
    }
  };


  const signIn = async (email: string, password: string) => {
    try {
      
      try {
        await account.deleteSessions();
      } catch (error) {
       
      }
      
     
      await account.createEmailPasswordSession(email, password);
      

      const currentUser = await account.get();
      setUser(currentUser);
      
      return { error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

 
  const signOut = async () => {
    try {
      await account.deleteSessions();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  /**
   * FORGOT PASSWORD - UI ONLY (No functionality)
   * 
   * Removed functionality as requested
   * Returns success to not break the UI
   */
  const forgotPassword = async (email: string) => {
    // No functionality - just return success
    return { error: null };
  };

  const updateName = async (name: string) => {
    try {
      if (!user) return { error: "User not logged in" };
      await account.updateName(name);
      
      // Update local state
      const updatedUser = await account.get();
      setUser(updatedUser);
      
      return { error: null };
    } catch (error: any) {
      console.error('Update name error:', error);
      return { error };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    forgotPassword,
    updateName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
