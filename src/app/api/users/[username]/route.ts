import { NextResponse } from "next/server";
import connectDB from "@/backend/config/database";
import User from "@/backend/models/user.model";
import Establishment from "@/backend/models/establishment.model";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    await connectDB();
    const { username: rawUsername } = await params;
    const username = String(rawUsername || "").trim().toLowerCase().replace(/^@+/, "");

    const userDoc = await User.findOne({ username }).select("-password").lean();

    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = {
      ...userDoc,
      circleCount: (userDoc.connections || []).length,
      spCount: (userDoc.savedPlaces || []).length
    };

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    await connectDB();
    const { username: rawUsername } = await params;
    const username = String(rawUsername || "").trim().toLowerCase().replace(/^@+/, "");

    // Delete from User collection
    const deletedUser = await User.findOneAndDelete({ username });

    // Delete from Establishment collection if establishment
    const deletedEst = await Establishment.findOneAndDelete({ username });

    if (!deletedUser && !deletedEst) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Account permanently deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
