import { NextResponse } from "next/server";

export async function GET() {
  try {
    const settings = {
      systemMode: 'auto' as const,
      manualPumpState: 'off' as const,
      moistureThreshold: 50,
      temperatureThreshold: 30,
      plantDescription: '',
    };
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error getting system settings:", error);
    return NextResponse.json({ error: "Failed to get system settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const updatedSettings = {
      systemMode: data.systemMode || 'auto',
      manualPumpState: data.manualPumpState || 'off',
      moistureThreshold: data.moistureThreshold || 50,
      temperatureThreshold: data.temperatureThreshold || 30,
      plantDescription: data.plantDescription || '',
    };
    
    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error("Error updating system settings:", error);
    return NextResponse.json({ error: "Failed to update system settings" }, { status: 500 });
  }
}
