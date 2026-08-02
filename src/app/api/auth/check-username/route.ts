import { NextResponse } from "next/server";
import connectDB from "@/backend/config/database";
import User from "@/backend/models/user.model";
import Establishment from "@/backend/models/establishment.model";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const rawUser = searchParams.get("username") || "";
    const username = String(rawUser).trim().toLowerCase().replace(/^@+/, "");

    if (!username || username.length < 3) {
      return NextResponse.json({ available: false, error: "Username must be at least 3 characters" });
    }

    if (!/^[a-z0-9._]{3,30}$/.test(username)) {
      return NextResponse.json({
        available: false,
        error: "Username can only contain lowercase letters, numbers, dots and underscores"
      });
    }

    const userDoc = await User.findOne({ username }).lean();
    if (userDoc) {
      return NextResponse.json({ username, available: false, taken: true, error: "Username is already taken by a user" });
    }

    const estDoc = await Establishment.findOne({ username }).lean();
    if (estDoc) {
      return NextResponse.json({ username, available: false, taken: true, error: "Username is already taken by a place" });
    }

    return NextResponse.json({ username, available: true, taken: false });
  } catch (error: any) {
    console.error("Check username error:", error);
    return NextResponse.json({ available: null, error: error?.message || String(error) }, { status: 500 });
  }
}
