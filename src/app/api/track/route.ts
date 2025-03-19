import { AUTHORIZATION_HEADER } from "@/lib/constants";
import { extractTransactionDetails } from "@/utils/tx";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header missing" },
        { status: 401 },
      );
    }

    if (authHeader !== AUTHORIZATION_HEADER) {
      return NextResponse.json(
        { error: "You don't have permissions to call this endpoint" },
        { status: 403 },
      );
    }

    const body = await request.json();

    const tx = extractTransactionDetails(body);
    console.log(JSON.stringify(tx, null, 2));
    if (!tx) {
      return NextResponse.json(
        { status: 404, detail: "TX not found" },
        { status: 404 },
      );
    }

    if (tx?.success && tx.senderAddress && tx.amount !== undefined) {
      return NextResponse.json(
        {
          status: 200,
          message: "Updated field successfully",
        },
        { status: 200 },
      );
    }

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error("Error processing transaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
