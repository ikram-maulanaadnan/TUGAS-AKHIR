import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SensorReading } from '@/types/sensor-data';

interface PumpChartProps {
  data: SensorReading[];
  latestReading: SensorReading | null;
}

export function PumpChart({ data, latestReading }: PumpChartProps) {
  const chartData = data.slice().reverse().map(reading => ({
    time: new Date(reading.timestamp).toLocaleTimeString(),
    pumpStatus: reading.pumpStatus ? 1 : 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pump Status History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
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
                domain={[0, 1]}
                tickCount={2}
                tickFormatter={(value) => value ? 'ON' : 'OFF'}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#111827', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: number | undefined) => value ? 'ON' : 'OFF'}
              />
              <Line 
                type="step" 
                dataKey="pumpStatus" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={false}
                name="Pump Status"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
