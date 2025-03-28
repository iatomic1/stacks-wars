import {
	SignedContractCallOptions,
	ClarityType,
	makeContractCall,
} from "@stacks/transactions";
import { contractName, contractAddress, NETWORK, broadcastTx } from "./wallet";

export const createGamePool = async (
	entryFee: number,
	senderKey: string // public key of the sender
) => {
	try {
		console.log(`Creating pool with entry fee ${entryFee}`);

		const txOptions: SignedContractCallOptions = {
			contractAddress,
			contractName,
			functionName: "create-pool",
			functionArgs: [{ type: ClarityType.UInt, value: entryFee }], // i trust this wont work as expected
			senderKey,
			network: NETWORK,
			postConditionMode: "allow",
		};

		const transaction = await makeContractCall(txOptions);

		return broadcastTx(transaction);
	} catch (error) {
		console.error("Error creating pool:", error);
		throw error;
	}
};
