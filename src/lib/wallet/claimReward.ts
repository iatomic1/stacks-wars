import {
	SignedContractCallOptions,
	ClarityType,
	makeContractCall,
} from "@stacks/transactions";
import {
	contractName,
	contractAddress,
	NETWORK,
	broadcastTx,
	generateWinnerSignature,
} from "./wallet";

export const claimPoolReward = async (
	poolId: number,
	winner: string,
	amount: number,
	senderKey: string
) => {
	try {
		console.log(`Claiming reward for pool ${poolId} with amount ${amount}`);

		const signature = await generateWinnerSignature(poolId, winner, amount);

		const txOptions: SignedContractCallOptions = {
			contractAddress,
			contractName,
			functionName: "claim-reward",
			functionArgs: [
				{ type: ClarityType.UInt, value: poolId },
				{ type: ClarityType.UInt, value: amount },
				{ type: ClarityType.Buffer, value: signature },
			],
			senderKey,
			network: NETWORK,
			postConditionMode: "allow",
		};

		const transaction = await makeContractCall(txOptions);
		return broadcastTx(transaction);
	} catch (error) {
		console.error("Error claiming reward:", error);
		throw error;
	}
};
