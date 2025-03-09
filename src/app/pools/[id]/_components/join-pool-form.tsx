"use client";

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
import { joinPoolAction } from "@/lib/actions/pools";
import { STX_TRANSFER_ADDRESS } from "@/lib/constants";
import { Label } from "@radix-ui/react-label";
import { request } from "@stacks/connect";
import { Loader, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";

export default function JoinPoolForm({
  amount,
  pool,
  // poolId,
}: {
  amount: number;
  pool: any;
  // poolId: string;
}) {
  const { user, loading: userLoading } = useUser();
  const router = useRouter(); // Properly initialize router

  // Determine if user can participate
  const canParticipate =
    user?.id &&
    pool.status === "open" &&
    pool.participants.length < pool.maxPlayers &&
    !pool.participants.some((participant) => participant.userId === user.id);

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
    if (!user?.id) {
      toast.error("Authentication required", {
        description: "Please connect wallet to join this pool",
      });
    }

    e.preventDefault();
    try {
      // const response = await request("stx_transferStx", {
      //   amount: amount * 1_000_000,
      //   recipient: STX_TRANSFER_ADDRESS,
      //   network: "mainnet",
      // });
      await execute({
        poolId: pool.id,
        userId: user?.id as string,
      });
    } catch (err) {
      console.error(err);
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
              disabled={userLoading || isPending || !canParticipate}
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
              ) : !canParticipate ? (
                pool?.participants.some((p) => p.userId === user.id) ? (
                  "Already Joined"
                ) : pool.status !== "open" ? (
                  "Pool Not Open"
                ) : (
                  "Pool Full"
                )
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
