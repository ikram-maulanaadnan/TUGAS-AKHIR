import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Generate mock system logs
    const logs = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      timestamp: new Date(Date.now() - i * 300000).toISOString(),
      type: i % 2 === 0 ? 'info' : 'warning',
      message: i % 2 === 0 ? 'Sensor data updated' : 'Soil moisture below threshold',
      metadata: JSON.stringify({ sensorId: `sensor_${i + 1}` }),
    }));

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error getting system logs:", error);
    return NextResponse.json({ error: "Failed to get system logs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...data,
    };
    
    return NextResponse.json(newLog);
  } catch (error) {
    console.error("Error adding system log:", error);
    return NextResponse.json({ error: "Failed to add system log" }, { status: 500 });
  }
}
