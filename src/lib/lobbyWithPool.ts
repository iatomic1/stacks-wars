import slugify from "react-slugify";
import { toast } from "sonner";
import { openContractDeploy } from "@stacks/connect";
import { userSession } from "@/context/WalletContext";
import { getClarityCode } from "@/lib/pool-clarity-code";

export const createLobbyWithPool = async (
	values,
	executeCreateLobbyWithPool,
	user
) => {
	const clarityCode = getClarityCode(values.amount);
	await openContractDeploy({
		network: "testnet",
		userSession: userSession,
		contractName: slugify(values.name) + "-stacks-wars",
		codeBody: clarityCode,
		onFinish: async (response) => {
			console.log(response, response.txId);
			try {
				console.log("calling");
				await executeCreateLobbyWithPool({
					lobby: {
						name: values.name,
						description: values.description,
						gameId: "543e3b33-8c49-43f0-9a04-60c97802b1b1",
						maxPlayers: values.players,
						creatorId: user.id,
					},
					pool: {
						entryAmount: values.amount?.toString() as string,
						maxPlayers: values.players,
						deployContractTxId: response.txId,
						lobbyId: "543e3b33-8c49-43f0-9a04-60c97802b1b1",
					},
				});
				console.log("called");
			} catch (error) {
				console.error("Error in executeCreateLobbyWithPool:", error);
				toast.error("Failed to create lobby with pool", {
					description:
						(error as Error).message || "An unknown error occurred",
				});
			}
		},

		onCancel: () => {
			toast("Failed to create pool", {
				description: "User cancelled transaction",
			});
		},
	});
};
