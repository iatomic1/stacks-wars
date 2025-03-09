"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  connect,
  disconnect,
  isConnected,
  getLocalStorage,
  StorageData,
} from "@stacks/connect";

type Address = {
  address: string;
};

type Addresses = {
  stx: Address[];
  btc: Address[];
};

interface WalletContextType {
  connected: boolean;
  addresses: Addresses | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  loading: boolean;
  error: Error | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [addresses, setAddresses] = useState<Addresses | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkConnection = () => {
      const connectionStatus = isConnected();
      setConnected(connectionStatus);

      if (connectionStatus) {
        const localData = getLocalStorage() as StorageData;
        if (localData && localData.addresses) {
          setAddresses(localData.addresses);
        }
      }
    };

    checkConnection();
  }, []);

  const connectWallet = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      await connect();

      const localData = getLocalStorage() as StorageData;

      if (localData && localData.addresses) {
        setAddresses(localData.addresses);
      }

      setConnected(true);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to connect wallet"),
      );
      console.error("Error connecting wallet:", err);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = (): void => {
    try {
      disconnect();
      setConnected(false);
      setAddresses(null);
    } catch (err) {
      console.error("Error disconnecting wallet:", err);
    }
  };

  const value: WalletContextType = {
    connected,
    addresses,
    connectWallet,
    disconnectWallet,
    loading,
    error,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
