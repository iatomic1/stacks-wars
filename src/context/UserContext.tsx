"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useWallet } from "./WalletContext";
import { User } from "@/lib/services/users";
import { fetchUserByAddress, createNewUser } from "@/lib/actions/user";

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  refetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { connected, address } = useWallet();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrCreateUser = async (stxAddress: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      let userRecord = await fetchUserByAddress(stxAddress);

      if (!userRecord) {
        const defaultUsername = `user_${stxAddress.slice(0, 6)}`;

        userRecord = await createNewUser({
          stxAddress,
          username: defaultUsername,
        });
      }

      setUser(userRecord);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch or create user"),
      );
      console.error("Error fetching or creating user:", err);
    } finally {
      setLoading(false);
    }
  };

  const refetchUser = async (): Promise<void> => {
    if (address) {
      await fetchOrCreateUser(address);
    }
  };

  useEffect(() => {
    if (connected && address) {
      fetchOrCreateUser(address);
    } else if (!connected) {
      setUser(null);
    }
  }, [connected, address]);

  const value: UserContextType = {
    user,
    loading,
    error,
    refetchUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
