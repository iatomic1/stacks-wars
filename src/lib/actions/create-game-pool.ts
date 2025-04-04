import { getClarityCode } from "../pool-clarity-code";
import { toast } from "sonner";
import { request } from "@stacks/connect";

export const createGamePool = async (
	amount: number,
	name: string,
	deployer: string
) => {
	const clarityCode = getClarityCode(amount, deployer);
	try {
		return await request("stx_deployContract", {
			name,
			clarityCode,
			network: "testnet",
		});
	} catch (error) {
		toast.error("Failed to deploy contract", {
			description: "Please try again later",
		});
		console.error("Failed to deploy contract", error);
		throw error;
	}
};
