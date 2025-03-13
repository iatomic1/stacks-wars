import { NextApiRequest, NextApiResponse } from "next";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userInput } = req.body;
  if (!userInput || typeof userInput !== "string") {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const command = new InvokeModelCommand({
      modelId: "amazon.titan-text-express-v1",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        inputText: `Is the word "${userInput}" valid in the English dictionary? Answer with just "yes" or "no".`,
      }),
    });

    const response = await client.send(command);
    const responseBody = await response.body?.transformToString();

    return res.status(200).json({ result: responseBody });
  } catch (error) {
    console.error("AWS Bedrock Error:", error);
    return res.status(500).json({ error: "Error processing the request" });
  }
}
