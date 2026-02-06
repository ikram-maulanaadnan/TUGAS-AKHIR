import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Generate mock sensor readings
    const readings = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      timestamp: new Date(Date.now() - i * 60000).toISOString(),
      temperature: 25 + Math.random() * 10,
      soilMoisture: 40 + Math.random() * 40,
      pumpStatus: Math.random() > 0.7,
      systemMode: 'auto',
    }));

    return NextResponse.json(readings);
  } catch (error) {
    console.error("Error getting sensor readings:", error);
    return NextResponse.json({ error: "Failed to get sensor readings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newReading = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...data,
    };
    
    return NextResponse.json(newReading);
  } catch (error) {
    console.error("Error adding sensor reading:", error);
    return NextResponse.json({ error: "Failed to add sensor reading" }, { status: 500 });
  }
}
