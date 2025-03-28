import {
	SignedTokenTransferOptions,
	makeSTXTokenTransfer,
} from "@stacks/transactions";
import { contractName, contractAddress, NETWORK, broadcastTx } from "./wallet";

export const joinGamePool = async (
	poolId: number,
	entryFee: number,
	senderKey: string // private key of the sender
) => {
	try {
		console.log(`Joining pool ${poolId} with entry fee ${entryFee}`);

		const txOptions: SignedTokenTransferOptions = {
			recipient: `${contractAddress}.${contractName}`,
			amount: entryFee,
			senderKey,
			memo: `Joining pool ${poolId}`,
			network: NETWORK,
		};

		const transaction = await makeSTXTokenTransfer(txOptions);
		return broadcastTx(transaction);
	} catch (error) {
		console.error("Error joining pool:", error);
		throw error;
	}
};
