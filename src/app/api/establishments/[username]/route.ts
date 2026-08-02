import { NextResponse } from "next/server";
import connectDB from "@/backend/config/database";
import Establishment from "@/backend/models/establishment.model";

function calculatePlaceScore(est: any) {
  const avgRating = Math.max(4.0, Math.min(9.9, est.avgRating || 4.0));
  const reviewCount = est.reviewCount || 0;
  const saves = est.saves || 0;
  const checkIns = est.checkIns || 0;
  const views = est.views || 0;
  const photoUploads = est.photoUploads || 0;
  const shareCount = est.shareCount || 0;
  const verified = est.verified || false;

  const qualityScore = Math.log10(1 + avgRating * reviewCount) * 40;
  const savesScore = Math.log10(1 + saves) * 30;
  const checkInScore = Math.log10(1 + checkIns) * 25;
  const reviewScore = Math.log10(1 + reviewCount) * 20;
  const viewScore = Math.log10(1 + views / 100) * 35;
  const photoScore = Math.log10(1 + photoUploads) * 20;
  const shareScore = Math.log10(1 + shareCount) * 20;
  const verifiedBonus = verified ? 50 : 0;

  const computed =
    100 +
    0.30 * qualityScore +
    0.20 * savesScore +
    0.15 * checkInScore +
    0.10 * reviewScore +
    0.10 * viewScore +
    0.03 * photoScore +
    0.03 * shareScore +
    0.02 * verifiedBonus;

  // Base 100 minimum, max 3000
  return Math.max(100, Math.min(3000, Math.round(computed)));
}

function getScoreTier(score: number) {
  if (score >= 2500) return { tier: "Campus Legend", badge: "👑", color: "#ffd700" };
  if (score >= 1201) return { tier: "Premium Place", badge: "💎", color: "#b9f2ff" };
  if (score >= 601) return { tier: "Highly Rated", badge: "🥇", color: "#ffd700" };
  if (score >= 201) return { tier: "Community Pick", badge: "🥈", color: "#c0c0c0" };
  return { tier: "Local Spot", badge: "🥉", color: "#cd7f32" };
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    await connectDB();
    const { username: rawUsername } = await params;
    const username = String(rawUsername || "").trim().toLowerCase().replace(/^@+/, "");

    const est = await Establishment.findOne({ username }).select("-password").lean();

    if (!est) {
      return NextResponse.json({ error: "Establishment not found" }, { status: 404 });
    }

    // Increment view count in background
    Establishment.updateOne({ username }, { $inc: { views: 1 }, lastActivity: new Date() }).catch(() => {});

    const placeScore = calculatePlaceScore(est);
    const scoreTier = getScoreTier(placeScore);
    const avgRating = Math.max(4.0, Math.min(9.9, est.avgRating || 4.0));

    return NextResponse.json({
      establishment: { ...est, avgRating, placeScore, scoreTier }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
