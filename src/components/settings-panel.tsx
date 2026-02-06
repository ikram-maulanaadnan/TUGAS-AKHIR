import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { SystemSettings } from '@/types/sensor-data';

interface SettingsPanelProps {
  settings: SystemSettings | null;
  isVisible: boolean;
  onClose: () => void;
}

export function SettingsPanel({ settings, isVisible, onClose }: SettingsPanelProps) {
  if (!isVisible || !settings) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            System Settings
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">System Mode</label>
            <p className="text-sm text-gray-500">{settings.systemMode}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Manual Pump State</label>
            <p className="text-sm text-gray-500">{settings.manualPumpState}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Moisture Threshold</label>
            <p className="text-sm text-gray-500">{settings.moistureThreshold}%</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Temperature Threshold</label>
            <p className="text-sm text-gray-500">{settings.temperatureThreshold}°C</p>
          </div>

          <Button className="w-full">Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
