import { NextResponse } from "next/server";
import connectDB from "@/backend/config/database";
import Establishment from "@/backend/models/establishment.model";

export async function GET() {
  try {
    await connectDB();
    const count = await Establishment.countDocuments();

    if (count === 0) {
      const seedItems = [
        {
          username: "mess_bh6",
          email: "mess_bh6@placebook.com",
          password: "password123",
          establishmentName: "Mess_BH6",
          category: "hostel",
          subcategory: "dining hall",
          description: "Main dining hall of Boys Hostel 6. Fresh breakfast, lunch & dinner every day.",
          tags: ["hostel", "food", "dining", "breakfast", "dinner"],
          phone: "+91 9876543210",
          website: "https://nits.ac.in",
          location: { country: "India", state: "Assam", city: "Silchar", address: "Boys Hostel 6, NIT Silchar Campus" },
          verified: true,
          placeScore: 100,
          saves: 0,
          savedBy: [],
          checkIns: 0,
          views: 0,
          avgRating: 4.0
        },
        {
          username: "canteen_bh6",
          email: "canteen_bh6@placebook.com",
          password: "password123",
          establishmentName: "Canteen_BH6",
          category: "food stall",
          subcategory: "canteen",
          description: "Tea, Coffee, Sandwiches, Cold Drinks & Snacks available late night.",
          tags: ["tea", "snacks", "fast food", "coffee"],
          phone: "+91 9876543211",
          website: "",
          location: { country: "India", state: "Assam", city: "Silchar", address: "Near Boys Hostel 6, NIT Silchar" },
          verified: true,
          placeScore: 100,
          saves: 0,
          savedBy: [],
          checkIns: 0,
          views: 0,
          avgRating: 4.0
        },
        {
          username: "foodcourt",
          email: "foodcourt@placebook.com",
          password: "password123",
          establishmentName: "Food Court",
          category: "restaurant",
          subcategory: "food court",
          description: "Main campus food court with regional delicacies, continental food & fast bites.",
          tags: ["restaurant", "cafe", "dinner", "lunch", "snacks"],
          phone: "+91 9876543212",
          website: "",
          location: { country: "India", state: "Assam", city: "Silchar", address: "Campus Center, NIT Silchar" },
          verified: true,
          placeScore: 100,
          saves: 0,
          savedBy: [],
          checkIns: 0,
          views: 0,
          avgRating: 4.0
        },
        {
          username: "tapri",
          email: "tapri@placebook.com",
          password: "password123",
          establishmentName: "Tapri",
          category: "cafe",
          subcategory: "tea stall",
          description: "Most popular evening tea & maggi hangout spot near campus main gate.",
          tags: ["tea", "maggi", "friends", "snacks"],
          phone: "+91 9876543213",
          website: "",
          location: { country: "India", state: "Assam", city: "Silchar", address: "Near Main Gate, NIT Silchar" },
          verified: true,
          placeScore: 100,
          saves: 0,
          savedBy: [],
          checkIns: 0,
          views: 0,
          avgRating: 4.0
        },
        {
          username: "basketball",
          email: "basketball@placebook.com",
          password: "password123",
          establishmentName: "Basketball Court",
          category: "sports",
          subcategory: "outdoor court",
          description: "Floodlit outdoor basketball court at NIT Silchar Sports Complex.",
          tags: ["sports", "fitness", "outdoor", "basketball"],
          phone: "",
          website: "",
          location: { country: "India", state: "Assam", city: "Silchar", address: "Sports Complex, NIT Silchar" },
          verified: true,
          placeScore: 100,
          saves: 0,
          savedBy: [],
          checkIns: 0,
          views: 0,
          avgRating: 4.0
        }
      ];

      await Establishment.insertMany(seedItems);
      return NextResponse.json({ message: "Initial seed data inserted into MongoDB", count: seedItems.length });
    }

    return NextResponse.json({ message: "Database already contains establishments", count });
  } catch (error: any) {
    console.error("Seed route error:", error);
    return NextResponse.json({ error: error.message || String(error), stack: error.stack }, { status: 500 });
  }
}
