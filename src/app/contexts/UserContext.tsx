import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserData {
  firstName: string;
  surname: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: Date;
  isNewUser?: boolean;
  connectedAccountsCount?: number;
  uploadedStatementsCount?: number;
}

interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
  clearNewUserFlag: () => void;
  addConnectedAccount: () => void;
  addUploadedStatement: () => void;
  getTotalAccountCount: () => number;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'pako_user_data';

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserData | null>(null);

  // Load user data from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        // Convert dateOfBirth back to Date object if it exists
        if (parsedUser.dateOfBirth) {
          parsedUser.dateOfBirth = new Date(parsedUser.dateOfBirth);
        }
        setUserState(parsedUser);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  }, []);

  // Save user data to localStorage whenever it changes
  const setUser = (userData: UserData | null) => {
    setUserState(userData);
    if (userData) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  const logout = () => {
    setUser(null);
  };
  
  const clearNewUserFlag = () => {
    if (user) {
      setUser({ ...user, isNewUser: false });
    }
  };

  const addConnectedAccount = () => {
    if (user) {
      setUser({ ...user, connectedAccountsCount: (user.connectedAccountsCount || 0) + 1 });
    }
  };

  const addUploadedStatement = () => {
    if (user) {
      setUser({ ...user, uploadedStatementsCount: (user.uploadedStatementsCount || 0) + 1 });
    }
  };

  const getTotalAccountCount = () => {
    return (user?.connectedAccountsCount || 0) + (user?.uploadedStatementsCount || 0);
  };

  const isAuthenticated = user !== null;

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        setUser, 
        isAuthenticated, 
        logout, 
        clearNewUserFlag, 
        addConnectedAccount, 
        addUploadedStatement, 
        getTotalAccountCount 
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}