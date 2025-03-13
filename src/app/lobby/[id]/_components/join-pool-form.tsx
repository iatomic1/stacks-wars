"use client";
import { Pc } from "@stacks/transactions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserContext";
import { userSession, useWallet } from "@/context/WalletContext";
import { joinPoolAction } from "@/lib/actions/pools";
import { POOL_SUFFIX, EXPLORER_BASE_URL } from "@/lib/constants";
import { SmartContractTransaction } from "@/types/transaction";
import { Label } from "@radix-ui/react-label";
import { openContractCall } from "@stacks/connect";
import { Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import slugify from "react-slugify";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";

export default function JoinPoolForm({
  amount,
  pool,
  initializeTx,
}: {
  amount: number;
  pool: any;
  initializeTx: SmartContractTransaction;
}) {
  const { user, loading: userLoading } = useUser();
  const { address } = useWallet();
  const router = useRouter(); // Properly initialize router

  const canParticipate =
    user?.id &&
    pool.participants.length < pool.maxPlayers &&
    !pool.participants.some((participant) => participant.userId === user.id);
  const [isLoading, setIsLoading] = useState(false);
  const { data, execute, isPending } = useServerAction(joinPoolAction, {
    onSuccess(result) {
      if (result.data.success) {
        const data = result.data.data;
        console.log(data);
        toast("Joined pool successfully!", {});
        router.refresh();
      }
    },
  });
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error("Authentication required", {
        description: "Please connect wallet to join this pool",
      });
      return; // Add this return to prevent further execution
    }

    try {
      setIsLoading(true);

      await openContractCall({
        network: "mainnet",
        userSession: userSession,
        contractAddress: `${pool.creator.stxAddress}`,
        contractName: `${slugify(pool.name)}${POOL_SUFFIX}`,
        functionName: "join-pool",
        functionArgs: [],
        postConditions: [
          Pc.principal(address as string)
            .willSendEq(Math.floor(amount * 1_000_000))
            .ustx(),
        ],
        onFinish: async (response) => {
          if (!response.txId) {
            console.log(response);
            throw new Error("Error calling contract function");
          }

          await execute({
            poolId: pool.id,
            userId: user?.id as string,
            txId: response.txId,
          });

          toast("Successfully joined pool", {
            description: `Transaction ID: ${response.txId}`,
            action: {
              label: "Explorer",
              onClick: () => {
                window.location.href = `${EXPLORER_BASE_URL}txid/${response.txId}`;
              },
            },
          });
          setIsLoading(false);
        },
        onCancel: () => {
          setIsLoading(false);
          toast("Failed to join pool", {
            description: "User cancelled transaction",
          });
        },
      });
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      toast.error("Failed to join pool", {
        description: "An error occurred while joining the pool",
      });
    }
  };

  return (
    <>
      <Card className="overflow-hidden border-primary/20 !pt-0">
        <CardHeader className="bg-primary/5 p-4 pb-3 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Join This Pool</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Entry fee:{" "}
            {(Number.parseFloat(pool.amount) / pool.maxPlayers).toFixed(2)} STX
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
            <div className="space-y-2">
              <Label htmlFor="stx-amount">STX Amount</Label>
              <Input
                id="stx-amount"
                type="number"
                placeholder="Enter amount in STX"
                value={amount}
                disabled
                required
              />
              <p className="text-xs text-muted-foreground">
                Prize Pool / Players
              </p>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={
                userLoading ||
                isPending ||
                !user?.id ||
                initializeTx.tx_status !== "success" ||
                !canParticipate
              }
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : userLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : !user?.id ? (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Connect Wallet to Join
                </>
              ) : initializeTx.tx_status !== "success" ? (
                "Pool Not Initialized"
              ) : pool?.participants.some((p) => p.userId === user.id) ? (
                "Already Joined"
              ) : pool.participants.length >= pool.maxPlayers ? (
                "Pool Full"
              ) : (
                "Join Pool"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-gray-500">
            By joining, you agree to the pool rules and terms.
          </p>
          <Link
            href="/about/pools"
            className="text-sm text-blue-500 hover:underline"
          >
            Learn how pools work
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}
