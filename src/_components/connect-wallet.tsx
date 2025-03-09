"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { useWallet } from "@/context/WalletContext";
import { truncateAddress } from "@/lib/utils";
import { Loader, Wallet2 } from "lucide-react";

export default function ConnectWallet() {
  const { connected, connectWallet, disconnectWallet, loading, addresses } =
    useWallet();

  return (
    <>
      {!connected ? (
        <Button variant={"outline"} onClick={connectWallet} disabled={loading}>
          {loading ? (
            <Loader className="h-4 w-4 mr-1 animate-spin" size={17} />
          ) : (
            <Wallet2 className="h-4 w-4 mr-1" size={17} />
          )}
          {loading ? "Connecting ..." : "Connect Wallet"}
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <span className="hidden md:inline text-xs text-muted-foreground font-medium">
            {addresses?.stx?.[0]
              ? truncateAddress(addresses.stx[0].address)
              : ""}
          </span>
          <Button onClick={disconnectWallet} variant="outline" size="sm">
            Disconnect
          </Button>
        </div>
      )}
    </>
  );
}
