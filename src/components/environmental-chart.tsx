import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SensorReading } from '@/types/sensor-data';

interface EnvironmentalChartProps {
  data: SensorReading[];
  latestReading: SensorReading | null;
}

export function EnvironmentalChart({ data, latestReading }: EnvironmentalChartProps) {
  const chartData = data.slice().reverse().map(reading => ({
    time: new Date(reading.timestamp).toLocaleTimeString(),
    temperature: reading.temperature,
    soilMoisture: reading.soilMoisture,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environmental Conditions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis 
                dataKey="time" 
                stroke="#9ca3af" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#9ca3af" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                domain={[0, 'auto']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#111827', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Area 
                type="monotone" 
                dataKey="temperature" 
                stroke="#ef4444" 
                fillOpacity={1} 
                fill="url(#colorTemp)"
                name="Temperature (°C)"
              />
              <Area 
                type="monotone" 
                dataKey="soilMoisture" 
                stroke="#22c55e" 
                fillOpacity={1} 
                fill="url(#colorMoisture)"
                name="Soil Moisture (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
