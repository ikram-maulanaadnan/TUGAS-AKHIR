import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { SystemSettings } from '@/types/sensor-data';

interface SettingsPanelProps {
  settings: SystemSettings | null;
  isVisible: boolean;
  onClose: () => void;
  onSave: (settings: SystemSettings) => void;
}

export function SettingsPanel({ settings, isVisible, onClose, onSave }: SettingsPanelProps) {
  const [plantDescription, setPlantDescription] = useState('');

  useEffect(() => {
    if (settings?.plantDescription) {
      setPlantDescription(settings.plantDescription);
    }
  }, [settings]);

  if (!isVisible || !settings) return null;

  const handleSave = () => {
    onSave({
      ...settings,
      plantDescription,
    });
  };

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

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Plant Description</label>
            <textarea
              value={plantDescription}
              onChange={(e) => setPlantDescription(e.target.value)}
              placeholder="Enter plant description..."
              className="w-full min-h-[100px] p-2 border border-gray-300 rounded-md text-sm text-gray-700 resize-y"
            />
          </div>

          <Button className="w-full" onClick={handleSave}>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
