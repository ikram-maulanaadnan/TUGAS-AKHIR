import { NextResponse } from "next/server";

export async function GET() {
  try {
    const status = {
      mqtt: 'connected',
      sensors: 'active',
      database: 'connected',
      lastReading: new Date().toISOString(),
    };
    
    return NextResponse.json(status);
  } catch (error) {
    console.error("Error getting system status:", error);
    return NextResponse.json({ error: "Failed to get system status" }, { status: 500 });
  }
}
