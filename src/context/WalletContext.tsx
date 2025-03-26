"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { showConnect } from "@stacks/connect";
import { AppConfig, UserSession } from "@stacks/connect";

// Create the AppConfig and UserSession
const appConfig = new AppConfig(["store_write", "publish_data"]);
export const userSession = new UserSession({ appConfig });

interface WalletContextType {
  connected: boolean;
  address: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  loading: boolean;
  error: Error | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
  appName?: string;
  appIconUrl?: string;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({
  children,
  appName = "My Stacks App",
  appIconUrl = "/logo.png",
}) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [address, setAddress] = useState<string | null>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkConnection = () => {
      try {
        // Try to check if user is signed in
        const isSignedIn = userSession.isUserSignedIn();
        setConnected(isSignedIn);

        if (isSignedIn) {
          try {
            const userData = userSession.loadUserData();
            // console.log(userData);
            if (userData.profile && userData.profile.stxAddress) {
              setAddress(
                userData.profile.stxAddress.mainnet ||
                  userData.profile.stxAddress.testnet,
              );
            }
          } catch (err) {
            console.warn("Error loading user data:", err);
            // Clear potentially corrupted session data
            userSession.signUserOut();
            setConnected(false);
          }
        }
      } catch (err) {
        console.warn("Error checking session state:", err);
        // Clear potentially corrupted session data
        try {
          userSession.signUserOut();
        } catch (clearErr) {
          console.error("Failed to clear session:", clearErr);
          // Last resort - try to clear localStorage directly
          try {
            localStorage.removeItem("blockstack-session");
            localStorage.removeItem("blockstack-gaia-hub-config");
          } catch (localStorageErr) {
            console.error("Failed to clear localStorage:", localStorageErr);
          }
        }
        setConnected(false);
      }
    };

    checkConnection();
  }, []);

  const connectWallet = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      showConnect({
        userSession,
        appDetails: {
          name: appName,
          icon: appIconUrl,
        },
        onFinish: () => {
          try {
            const userData = userSession.loadUserData();
            if (userData.profile && userData.profile.stxAddress) {
              setAddress(
                userData.profile.stxAddress.mainnet ||
                  userData.profile.stxAddress.testnet,
              );
            }
            setConnected(true);
          } catch (err) {
            console.error("Error loading user data after connect:", err);
            setError(new Error("Failed to load user data after connection"));
          } finally {
            setLoading(false);
          }
        },
        onCancel: () => {
          setLoading(false);
        },
      });
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to connect wallet"),
      );
      console.error("Error connecting wallet:", err);
      setLoading(false);
    }
  };

  const disconnectWallet = (): void => {
    try {
      userSession.signUserOut();
      setConnected(false);
      setAddress(null);
    } catch (err) {
      console.error("Error disconnecting wallet:", err);
      // If signUserOut fails, try direct localStorage removal
      try {
        localStorage.removeItem("blockstack-session");
        localStorage.removeItem("blockstack-gaia-hub-config");
        setConnected(false);
        setAddress(null);
      } catch (localStorageErr) {
        console.error("Failed to clear localStorage:", localStorageErr);
      }
    }
  };

  const value: WalletContextType = {
    connected,
    address: address,
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
