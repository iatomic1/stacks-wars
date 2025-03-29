import { getLobbyById } from "@/lib/services/lobby";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const lobby = await getLobbyById(id);
    if (!lobby) {
      return NextResponse.json({ error: "Lobby not found" }, { status: 404 });
    }
    console.log(id);
    return NextResponse.json({
      message: "Lobby retrieved successfully",
      data: lobby,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
