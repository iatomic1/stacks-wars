"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/context/UserContext";
import { useJoinLobby } from "@/hooks/useJoinLobby";
import { request } from "@stacks/connect";
import { StxPostCondition } from "@stacks/transactions";
import { Loader } from "lucide-react";
import { toast } from "sonner";

interface JoinPoolFormProps {
  amount: number;
  maxPlayers?: number;
  currentPlayers?: number;
  isUserJoined?: boolean;
  isUserConnected?: boolean;
  lobbyId: string;
  withPool: boolean;
}

export default function JoinLobbyForm({
  amount,
  maxPlayers = 20,
  currentPlayers = 0,
  isUserJoined = false,
  isUserConnected = true,
  lobbyId,
  withPool = false,
}: JoinPoolFormProps) {
  //const router = useRouter();
  const isLoading = false;
  const { isJoining, joinLobby } = useJoinLobby();
  const { user } = useUser();
  const isFull = currentPlayers >= maxPlayers;

  const handleSubmit = async () => {
    if (!user) {
      toast.info("zyou need to be logged in");
      return;
    }
    console.log(`Joining lobby ${lobbyId} with amount:`, amount);
    // Here you can add any additional logic needed when joining the pool
    const contract = `ST16VAAGEE7XE3DFZZSFDW7T5SCJR1N0WY2M1PXJ7.Flames-stacks-wars`; //replace with actual contract address
    // replace with actual addy and amount
    if (withPool) {
      try {
        const stxPostCondition: StxPostCondition = {
          type: "stx-postcondition",
          address: "STF0V8KWBS70F0WDKTMY65B3G591NN52PR4Z71Y3",
          condition: "eq",
          amount: amount,
        };

        const response = await request("stx_callContract", {
          contract,
          functionName: "join-pool",
          functionArgs: [],
          network: "testnet",
          postConditionMode: "deny",
          postConditions: [stxPostCondition],
        });
        console.log("Transaction successfull:", response.txid);
      } catch (error) {
        console.error("Wallet returned an error:", error);
        throw error;
      }
    } else {
      console.log("hello");
      await joinLobby({
        userId: user.id,
        lobbyId: lobbyId,
        stxAddress: user?.stxAddress,
        username: user.stxAddress,
      });
    }

    // implement join pool logic here
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join Lobby</CardTitle>
        <CardDescription>
          Join this lobby to participate in the game
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm font-medium mb-1">Entry Fee</p>
          <p className="text-2xl font-bold">{amount || 0} STX</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          size="lg"
          disabled={isLoading || isFull || isUserJoined || !isUserConnected}
          onClick={handleSubmit}
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Joining...
            </>
          ) : isUserJoined ? (
            "Already Joined"
          ) : !isUserConnected ? (
            "Connect Wallet to Join"
          ) : isFull ? (
            "Pool is Full"
          ) : (
            "Join Lobby"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
