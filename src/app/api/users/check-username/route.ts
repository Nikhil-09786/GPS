import { NextResponse } from "next/server";
import connectDB from "@/backend/config/database";
import User from "@/backend/models/user.model";
import Establishment from "@/backend/models/establishment.model";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const username = String(searchParams.get("username") || "")
      .trim()
      .toLowerCase()
      .replace(/^@+/, "");

    if (!username || username.length < 3) {
      return NextResponse.json({ available: false, error: "Username must be at least 3 characters" });
    }

    if (!/^[a-z0-9._]{3,30}$/.test(username)) {
      return NextResponse.json({
        available: false,
        error: "Username can only contain lowercase letters, numbers, dots and underscores"
      });
    }

    const exactRegex = new RegExp(`^${username.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");

    const userExists = await User.exists({ username: exactRegex });
    const estExists = await Establishment.exists({ username: exactRegex });

    const isAvailable = !userExists && !estExists;

    return NextResponse.json({ username, available: isAvailable });
  } catch (error: any) {
    return NextResponse.json({ available: false, error: error.message }, { status: 500 });
  }
}
