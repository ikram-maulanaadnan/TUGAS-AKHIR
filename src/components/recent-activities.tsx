import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { SystemLog } from '@/types/sensor-data';

interface RecentActivitiesProps {
  logs: SystemLog[];
}

export function RecentActivities({ logs }: RecentActivitiesProps) {
  const getLogIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pump_action':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLogTextColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      case 'pump_action':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.length === 0 ? (
            <p className="text-sm text-gray-500">No recent activities</p>
          ) : (
            logs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-start space-x-3">
                <div className="mt-1">{getLogIcon(log.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${getLogTextColor(log.type)}`}>
                    {log.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
