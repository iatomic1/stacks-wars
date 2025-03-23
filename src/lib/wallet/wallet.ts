import { generateWallet } from "@stacks/wallet-sdk";
import {
	getAddressFromPrivateKey,
	makeContractCall,
	makeSTXTokenTransfer,
	SignedContractCallOptions,
	SignedTokenTransferOptions,
	ClarityType,
	broadcastTransaction,
	TxBroadcastResult,
	StacksTransactionWire,
	signMessageHashRsv,
} from "@stacks/transactions";
import { Wallet } from "@/types/wallet";
import { STACKS_TESTNET } from "@stacks/network";
import { hashMessage } from "@stacks/encryption";

export const getWallet = async (secretKey: string, password: string = "") =>
	await generateWallet({ secretKey, password });

export const generatePrivateKey = (wallet: Wallet) =>
	wallet.accounts[0].stxPrivateKey;

export const getWalletAddress = (wallet: Wallet) =>
	getAddressFromPrivateKey(wallet.accounts[0].stxPrivateKey);

const wallet = await getWallet(process.env.SECRET_KEY || "");

// Contract details
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || ""; // Replace with your contract deployer address
const CONTRACT_NAME = process.env.CONTRACT_NAME || ""; // Replace with your contract name

// Trusted signer wallet (replace with your values)
const TRUSTED_SIGNER_KEY = generatePrivateKey(wallet);
const TRUSTED_SIGNER_ADDRESS = getWalletAddress(wallet);

// Network configuration
const NETWORK = STACKS_TESTNET;

const broadcastTx = async (transaction: StacksTransactionWire) => {
	const txResponse: TxBroadcastResult = await broadcastTransaction({
		transaction,
	});

	if ("txid" in txResponse) {
		console.log("Transaction successful with ID:", txResponse.txid);
		return txResponse.txid;
	} else {
		console.error("Transaction failed with error:", txResponse);
	}
};

export const createGamePool = async (
	entryFee: number,
	creatorWalletAddress: string
) => {
	try {
		console.log(
			`Creating pool with entry fee ${entryFee} as ${creatorWalletAddress}`
		);

		const txOptions: SignedContractCallOptions = {
			contractAddress: CONTRACT_ADDRESS,
			contractName: CONTRACT_NAME,
			functionName: "create-pool",
			functionArgs: [{ type: ClarityType.UInt, value: entryFee }], // i trust this wont work as expected
			senderKey: TRUSTED_SIGNER_KEY,
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

export const joinGamePool = async (poolId: number, entryFee: number) => {
	try {
		console.log(`Joining pool ${poolId} with entry fee ${entryFee}`);

		const txOptions: SignedTokenTransferOptions = {
			recipient: `${TRUSTED_SIGNER_ADDRESS}.${CONTRACT_NAME}`,
			amount: entryFee,
			senderKey: TRUSTED_SIGNER_KEY,
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

const generateWinnerSignature = async (
	poolId: number,
	winner: string,
	amount: number
) => {
	try {
		const message = `pool-${poolId}-winner-${winner}-amount-${amount}`;

		// Hash the message
		const messageHash = hashMessage(message);

		// Sign the hash with the trusted signer's private key
		const signature = signMessageHashRsv({
			privateKey: TRUSTED_SIGNER_KEY,
			messageHash: Buffer.from(messageHash).toString("hex"),
		});

		console.log(
			`Generated signature for ${winner} to claim ${amount} STX from pool ${poolId}`
		);
		console.log("Signature:", signature);

		return signature;
	} catch (error) {
		console.error("Error generating winner signature:", error);
		throw error;
	}
};

export const claimPoolReward = async (
	poolId: number,
	winner: string,
	amount: number
) => {
	try {
		console.log(`Claiming reward for pool ${poolId} with amount ${amount}`);

		const signature = await generateWinnerSignature(poolId, winner, amount);

		const txOptions: SignedContractCallOptions = {
			contractAddress: CONTRACT_ADDRESS,
			contractName: CONTRACT_NAME,
			functionName: "claim-reward",
			functionArgs: [
				{ type: ClarityType.UInt, value: poolId },
				{ type: ClarityType.UInt, value: amount },
				{ type: ClarityType.Buffer, value: signature },
			],
			senderKey: TRUSTED_SIGNER_KEY,
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
