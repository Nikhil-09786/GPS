import { NextResponse } from "next/server";
import connectDB from "@/backend/config/database";
import Establishment from "@/backend/models/establishment.model";
import User from "@/backend/models/user.model";

function computePlaceScore(est: any) {
  const avgRating = Math.max(4.0, Math.min(9.9, est.avgRating || 4.0));
  const reviewCount = est.reviewCount || 0;
  const saves = est.saves || 0;
  const checkIns = est.checkIns || 0;
  const views = est.views || 0;
  const photoUploads = est.photoUploads || 0;
  const shareCount = est.shareCount || 0;

  const ratingWeight = 0.30 * Math.log10(1 + avgRating * reviewCount) * 40;
  const savesWeight = 0.20 * Math.log10(1 + saves) * 30;
  const checkInsWeight = 0.15 * Math.log10(1 + checkIns) * 25;
  const reviewCountWeight = 0.10 * Math.log10(1 + reviewCount) * 20;
  const viewsWeight = 0.10 * Math.log10(1 + views / 100) * 35;
  const photoWeight = 0.03 * Math.log10(1 + photoUploads) * 20;
  const shareWeight = 0.03 * Math.log10(1 + shareCount) * 20;
  const verifiedBonus = est.verified ? 50 : 0;

  const rawScore = 100 + ratingWeight + savesWeight + checkInsWeight + reviewCountWeight + viewsWeight + photoWeight + shareWeight + verifiedBonus;
  // Base 100 minimum, max 3000
  return Math.max(100, Math.min(3000, Math.round(rawScore)));
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    await connectDB();
    const { username: rawUsername } = await params;
    const placeUsername = String(rawUsername || "").trim().toLowerCase().replace(/^@+/, "");

    const { userUsername, action } = await req.json().catch(() => ({}));
    const cleanUser = userUsername ? String(userUsername).trim().toLowerCase().replace(/^@+/, "") : "";

    const est = await Establishment.findOne({ username: placeUsername });

    if (!est) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    if (!Array.isArray(est.savedBy)) {
      est.savedBy = [];
    }

    const isCurrentlySaved = cleanUser ? est.savedBy.includes(cleanUser) : false;

    let targetSaved = false;
    if (action === "save" || (!action && !isCurrentlySaved)) {
      targetSaved = true;
    } else if (action === "unsave" || (!action && isCurrentlySaved)) {
      targetSaved = false;
    }

    if (targetSaved) {
      if (cleanUser && !est.savedBy.includes(cleanUser)) {
        est.savedBy.push(cleanUser);
      }
      est.saves = (est.saves || 0) + 1;

      // Add to User's savedPlaces array if user found
      if (cleanUser) {
        await User.findOneAndUpdate(
          { username: cleanUser },
          { $addToSet: { savedPlaces: placeUsername } }
        );
      }
    } else {
      if (cleanUser) {
        est.savedBy = est.savedBy.filter((u: string) => u !== cleanUser);
      }
      est.saves = Math.max(0, (est.saves || 0) - 1);

      // Remove from User's savedPlaces array if user found
      if (cleanUser) {
        await User.findOneAndUpdate(
          { username: cleanUser },
          { $pull: { savedPlaces: placeUsername } }
        );
      }
    }

    est.avgRating = Math.max(4.0, Math.min(9.9, est.avgRating || 4.0));
    est.placeScore = computePlaceScore(est);
    est.lastActivity = new Date();

    await est.save();

    return NextResponse.json({
      saved: targetSaved,
      savesCount: est.saves,
      placeScore: est.placeScore,
      avgRating: est.avgRating
    });
  } catch (error: any) {
    console.error("Save/Unsave route error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
