import { NextResponse } from "next/server";
import connectDB from "@/backend/config/database";
import Establishment from "@/backend/models/establishment.model";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const username = String(body.username || "").trim().toLowerCase().replace(/^@+/, "");
    const email = String(body.email || "").trim().toLowerCase();
    const establishmentName = String(body.establishmentName || "").trim();

    if (!establishmentName) {
      return NextResponse.json({ error: "Establishment name is required" }, { status: 400 });
    }

    if (!/^[a-z0-9._]{3,30}$/.test(username)) {
      return NextResponse.json(
        { error: "Username must be 3–30 lowercase letters, numbers, dots or underscores" },
        { status: 400 }
      );
    }

    if (!body.category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (!body.password || body.password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const [estExists, emailExists] = await Promise.all([
      Establishment.exists({ username }),
      Establishment.exists({ email })
    ]);

    if (estExists) {
      return NextResponse.json({ error: "Username is already taken" }, { status: 409 });
    }

    if (emailExists) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 409 });
    }

    const tags = Array.isArray(body.tags)
      ? body.tags
      : String(body.tags || "").split(",").map((s) => s.trim()).filter(Boolean);

    const establishment = await Establishment.create({
      establishmentName,
      username,
      email,
      password: body.password,
      category: body.category,
      subcategory: body.subcategory || "",
      description: body.description || "Welcome to our place on PlaceBook!",
      tags,
      phone: body.phone || "",
      website: body.website || "",
      location: {
        country: body.country || "India",
        state: body.state || "Assam",
        city: body.city || "Silchar",
        address: body.address || "NIT Silchar Campus"
      },
      image: body.image || ""
    });

    const doc = establishment.toObject();
    delete doc.password;

    return NextResponse.json(
      { message: "Establishment profile created", establishment: doc },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Establishment registration error:", error);
    return NextResponse.json({ error: error.message || "Failed to create establishment" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    const query = q
      ? {
          $or: [
            { establishmentName: { $regex: q, $options: "i" } },
            { username: { $regex: q, $options: "i" } },
            { category: { $regex: q, $options: "i" } },
            { subcategory: { $regex: q, $options: "i" } },
            { tags: { $regex: q, $options: "i" } },
            { "location.city": { $regex: q, $options: "i" } }
          ]
        }
      : {};

    const establishments = await Establishment.find(query).select("-password").sort({ createdAt: -1 }).limit(30).lean();
    return NextResponse.json({ establishments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch places" }, { status: 500 });
  }
}
