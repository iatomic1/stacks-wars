import {
	serializeCV,
	tupleCV,
	uintCV,
	principalCV,
	StacksTransactionWire,
	signMessageHashRsv,
	getAddressFromPrivateKey,
	TxBroadcastResult,
	broadcastTransaction,
	//privateKeyToPublic,
} from "@stacks/transactions";
import { createHash } from "crypto";
import { generateWallet } from "@stacks/wallet-sdk";
import { Wallet } from "@/types/wallet";
import { PrivateKey } from "@stacks/common";
import { STACKS_TESTNET } from "@stacks/network";

const secretKey = process.env.TRUSTED_SIGNER_SECRET_KEY || "";
//("twice kind fence tip hidden tilt action fragile skin nothing glory cousin green tomorrow spring wrist shed math olympic multiply hip blue scout claw");

export const NETWORK = STACKS_TESTNET;

const getWallet = async (secretKey: string, password: string = "") =>
	await generateWallet({ secretKey, password });

const generatePrivateKey = (wallet: Wallet) => wallet.accounts[0].stxPrivateKey;

export const getWalletAddress = (wallet: Wallet) =>
	getAddressFromPrivateKey(generatePrivateKey(wallet));

const wallet = await getWallet(secretKey);

const privateKey: PrivateKey = generatePrivateKey(wallet);

export const contractAddress = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
export const contractName = "pool-2";

// Get Public Key
//console.log("Public key", privateKeyToPublic(generatePrivateKey(wallet)));

const sha256 = (buffer: Buffer): Buffer => {
	return createHash("sha256").update(buffer).digest();
};

export const createClarityMessageHash = (
	poolId: number,
	amount: number,
	winnerAddress: string
) => {
	const message = tupleCV({
		"pool-id": uintCV(poolId),
		amount: uintCV(amount),
		winner: principalCV(winnerAddress),
	});

	const serialized = serializeCV(message); // Serializes the tuple
	console.log(serialized);
	const hash = sha256(Buffer.from(serialized, "hex"));
	return hash;
};

export const broadcastTx = async (transaction: StacksTransactionWire) => {
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

export const generateWinnerSignature = async (
	poolId: number,
	winner: string,
	amount: number
) => {
	const hash = createClarityMessageHash(poolId, amount, winner);
	return signMessageHashRsv({
		messageHash: hash.toString("hex"),
		privateKey,
	});
};

// Example usage
//const poolId = 1;
//const amount = 200;
//const winnerAddress = "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5";
//const hash = createClarityMessageHash(poolId, amount, winnerAddress);
//console.log("Hash:", hash.toString("hex"));
//const signature = signMessageHashRsv({
//	messageHash: hash.toString("hex"),
//	privateKey,
//});

//console.log("Signature:", signature);
