import { NextResponse } from "next/server";
import connectDB from "@/backend/config/database";
import User from "@/backend/models/user.model";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    await connectDB();
    const { username: rawUsername } = await params;
    const targetUsername = String(rawUsername || "").trim().toLowerCase().replace(/^@+/, "");

    const { currentUsername, action } = await req.json().catch(() => ({}));
    const cleanCurrent = currentUsername ? String(currentUsername).trim().toLowerCase().replace(/^@+/, "") : "";

    if (!cleanCurrent) {
      return NextResponse.json({ error: "Logged in user username is required" }, { status: 400 });
    }

    const targetUser = await User.findOne({ username: targetUsername });
    if (!targetUser) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    }

    const connections = targetUser.connections || [];
    const isConnected = connections.includes(cleanCurrent);

    let targetState = false;
    if (action === "connect" || (!action && !isConnected)) {
      targetState = true;
    } else if (action === "disconnect" || (!action && isConnected)) {
      targetState = false;
    }

    if (targetState) {
      if (!connections.includes(cleanCurrent)) {
        targetUser.connections.push(cleanCurrent);
      }
    } else {
      targetUser.connections = connections.filter((u: string) => u !== cleanCurrent);
    }

    await targetUser.save();

    return NextResponse.json({
      connected: targetState,
      circleCount: targetUser.connections.length
    });
  } catch (error: any) {
    console.error("Connect API error:", error);
    return NextResponse.json({ error: error.message || "Failed to update connection" }, { status: 500 });
  }
}
