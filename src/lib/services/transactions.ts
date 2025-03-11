import { SmartContractTransaction } from "@/types/transaction";
import { HIRO_API_BASE_URL } from "../constants";

export default async function getTransaction(
  txId: string,
): Promise<SmartContractTransaction | null> {
  try {
    const response = await fetch(`${HIRO_API_BASE_URL}extended/v1/tx/${txId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error("Error getting transaction");
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}
