import { StxPostCondition } from "@stacks/transactions";
import { request } from "@stacks/connect";
import { toast } from "sonner";

export const joinGamePool = async (
	contract: `${string}.${string}`,
	address: string,
	amount: number
) => {
	try {
		const stxPostCondition: StxPostCondition = {
			type: "stx-postcondition",
			address,
			condition: "eq",
			amount: amount * 1000000,
		};

		return await request("stx_callContract", {
			contract,
			functionName: "join-pool",
			functionArgs: [],
			network: "testnet",
			postConditionMode: "deny",
			postConditions: [stxPostCondition],
		});
	} catch (error) {
		toast.error("Failed to join pool", {
			description: "Please try again",
		});
		console.error("Wallet returned an error:", error);
		throw error;
	}
};
