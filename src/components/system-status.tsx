import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi, Database, Activity, Clock } from 'lucide-react';
import type { SystemStatus } from '@/types/sensor-data';

interface SystemStatusComponentProps {
  status: SystemStatus | null;
}

export function SystemStatusComponent({ status }: SystemStatusComponentProps) {
  if (!status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Loading system status...</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (statusValue: string) => {
    return statusValue === 'connected' || statusValue === 'active' ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (statusValue: string) => {
    return statusValue === 'connected' || statusValue === 'active' ? '✓' : '✗';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Wifi className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium">MQTT Connection</span>
          </div>
          <span className={`flex items-center space-x-1 text-sm ${getStatusColor(status.mqtt)}`}>
            <span>{getStatusIcon(status.mqtt)}</span>
            <span className="capitalize">{status.mqtt}</span>
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium">Sensors</span>
          </div>
          <span className={`flex items-center space-x-1 text-sm ${getStatusColor(status.sensors)}`}>
            <span>{getStatusIcon(status.sensors)}</span>
            <span className="capitalize">{status.sensors}</span>
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium">Database</span>
          </div>
          <span className={`flex items-center space-x-1 text-sm ${getStatusColor(status.database)}`}>
            <span>{getStatusIcon(status.database)}</span>
            <span className="capitalize">{status.database}</span>
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium">Last Reading</span>
          </div>
          <span className="text-sm text-gray-600">
            {new Date(status.lastReading).toLocaleTimeString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
