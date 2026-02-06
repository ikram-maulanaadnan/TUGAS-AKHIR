import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Generate and save test data
    const testReading = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      temperature: 25 + Math.random() * 10,
      soilMoisture: 40 + Math.random() * 40,
      pumpStatus: Math.random() > 0.7,
      systemMode: 'auto',
    };

    const testLog = {
      id: Date.now() + 1,
      timestamp: new Date().toISOString(),
      type: 'info',
      message: 'Test data generated',
      metadata: JSON.stringify({ source: 'test' }),
    };

    console.log('Test data generated:', { testReading, testLog });
    
    return NextResponse.json({ success: true, message: 'Test data generated successfully' });
  } catch (error) {
    console.error("Error generating test data:", error);
    return NextResponse.json({ error: "Failed to generate test data" }, { status: 500 });
  }
}
