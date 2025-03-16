//"use client";
//import { Button } from "@/components/ui/button";
//import { useUser } from "@/context/UserContext";
//import { userSession } from "@/context/WalletContext";
//import { updatePoolStatusAction } from "@/lib/actions/pools";
//import { EXPLORER_BASE_URL, POOL_SUFFIX } from "@/lib/constants";
//import { openContractCall } from "@stacks/connect";
//import { stringAsciiCV, uintCV } from "@stacks/transactions";
//import { Loader } from "lucide-react";
//import { useState } from "react";
//import slugify from "react-slugify";
//import { toast } from "sonner";
//import { useServerAction } from "zsa-react";

//export default function InitialisePool({
//  poolCreatorAddress,
//  txSenderAddress,
//  poolName,
//  maxPlayers,
//  totalPrize,
//  poolId,
//}: {
//  poolCreatorAddress: string;
//  txSenderAddress: string;
//  poolName: string;
//  maxPlayers: number;
//  totalPrize: number;
//  poolId: string;
//}) {
//  const { user } = useUser();
//  const [isLoading, setIsLoading] = useState(false);
//  const { execute } = useServerAction(updatePoolStatusAction, {
//    onSuccess(result) {
//      if (result.data.success) {
//        const data = result.data.data;
//        console.log(data);
//        // toast("Pool  successfully!", {
//        //   description:
//        //     "Your pool has been created and is now open for players to join.",
//        // });
//      }
//    },
//    onError(error) {
//      console.error("Server action error:", error);
//      toast("Failed to update pool status", {
//        description: error.message || "An unexpected error occurred",
//      });
//    },
//  });

//  return (
//    <>
//      {user?.stxAddress === poolCreatorAddress &&
//        user?.stxAddress === txSenderAddress && (
//          <Button
//            variant={"outline"}
//            onClick={async () => {
//              setIsLoading(true);
//              try {
//                await openContractCall({
//                  network: "mainnet",
//                  userSession: userSession,
//                  contractAddress: `${txSenderAddress}`,
//                  contractName: `${slugify(poolName)}${POOL_SUFFIX}`,
//                  functionName: "initialize-pool",
//                  functionArgs: [
//                    stringAsciiCV(poolName),
//                    uintCV(maxPlayers),
//                    uintCV(totalPrize * 1_000_000),
//                  ],
//                  onFinish: async (response) => {
//                    if (!response.txId) {
//                      console.log(response);
//                      throw new Error("Error calling contract function");
//                    }
//                    console.log("updating BE");
//                    await execute({
//                      status: "initializing",
//                      poolId: poolId,
//                      initializeTxId: response.txId,
//                    });
//                    toast("Pool initialized successfully", {
//                      description: `Transaction ID: ${response.txId}`,
//                      action: {
//                        label: "Explorer",
//                        onClick: () => {
//                          window.location.href = `${EXPLORER_BASE_URL}txid/${response.txId}`;
//                        },
//                      },
//                    });
//                    setIsLoading(false);
//                  },
//                  onCancel: () => {
//                    toast("Failed to initialize pool", {
//                      description: "User cancelled transaction",
//                    });
//                  },
//                });
//              } catch (error) {
//                console.error(error);
//              }
//            }}
//          >
//            {isLoading && (
//              <Loader
//                className="h-4 w-4 mr-1 animate-spin"
//                strokeWidth={1.25}
//              />
//            )}
//            Initialise Pool
//          </Button>
//        )}
//    </>
//  );
//}
