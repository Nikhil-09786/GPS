import { NextResponse } from "next/server";
import connectDB from "@/backend/config/database";
import User from "@/backend/models/user.model";
import Establishment from "@/backend/models/establishment.model";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const queryStr = q.trim();

    const filterEst = queryStr
      ? {
          $or: [
            { establishmentName: { $regex: queryStr, $options: "i" } },
            { username: { $regex: queryStr, $options: "i" } },
            { category: { $regex: queryStr, $options: "i" } },
            { subcategory: { $regex: queryStr, $options: "i" } },
            { tags: { $regex: queryStr, $options: "i" } },
            { "location.city": { $regex: queryStr, $options: "i" } }
          ]
        }
      : {};

    const filterUser = queryStr
      ? {
          $or: [
            { name: { $regex: queryStr, $options: "i" } },
            { username: { $regex: queryStr, $options: "i" } },
            { occupation: { $regex: queryStr, $options: "i" } },
            { college: { $regex: queryStr, $options: "i" } },
            { location: { $regex: queryStr, $options: "i" } }
          ]
        }
      : {};

    const [establishments, users] = await Promise.all([
      Establishment.find(filterEst).select("-password").sort({ createdAt: -1 }).limit(20).lean(),
      User.find(filterUser).select("-password").sort({ createdAt: -1 }).limit(20).lean()
    ]);

    const results = [
      ...users.map((u: any) => ({ ...u, type: "user" })),
      ...establishments.map((e: any) => ({ ...e, type: "establishment" }))
    ];

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error("Search route error:", error);
    return NextResponse.json({ error: error.message || "Search failed" }, { status: 500 });
  }
}
