import { NextRequest, NextResponse } from "next/server";
import { getAIRecommendations } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");
    const recommendations = await getAIRecommendations(limit);

    return NextResponse.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error("Error fetching AI recommendations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
