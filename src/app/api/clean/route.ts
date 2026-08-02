import { NextResponse } from "next/server";
import connectDB from "@/backend/config/database";
import User from "@/backend/models/user.model";

export async function GET() {
  try {
    await connectDB();
    const result = await User.deleteMany({ username: "martin" });
    return NextResponse.json({ message: "Deleted profile martin", count: result.deletedCount });
  } catch (error: any) {
    console.error("Clean API error:", error);
    return NextResponse.json({ error: error.message || String(error), stack: error.stack }, { status: 500 });
  }
}
