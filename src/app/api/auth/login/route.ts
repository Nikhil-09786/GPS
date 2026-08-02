import { NextResponse } from "next/server";
import connectDB from "@/backend/config/database";
import User from "@/backend/models/user.model";
import Establishment from "@/backend/models/establishment.model";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json({ error: "Please enter username/email and password" }, { status: 400 });
    }

    const cleanIdentifier = String(identifier).trim().toLowerCase().replace(/^@+/, "");

    // 1. Search in User collection
    const userDoc = await User.findOne({
      $or: [
        { username: cleanIdentifier },
        { email: cleanIdentifier }
      ]
    });

    if (userDoc) {
      if (userDoc.password !== password) {
        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
      }

      return NextResponse.json({
        message: "Login successful",
        accountType: "user",
        username: userDoc.username,
        user: {
          name: userDoc.name,
          username: userDoc.username,
          email: userDoc.email
        }
      });
    }

    // 2. Search in Establishment collection
    const estDoc = await Establishment.findOne({
      $or: [
        { username: cleanIdentifier },
        { email: cleanIdentifier }
      ]
    });

    if (estDoc) {
      if (estDoc.password !== password) {
        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
      }

      return NextResponse.json({
        message: "Login successful",
        accountType: "establishment",
        username: estDoc.username,
        establishment: {
          establishmentName: estDoc.establishmentName,
          username: estDoc.username,
          email: estDoc.email
        }
      });
    }

    return NextResponse.json({ error: "Account not found with this username or email" }, { status: 404 });
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 500 });
  }
}
