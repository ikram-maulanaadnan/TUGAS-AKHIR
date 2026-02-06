import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Sprout } from 'lucide-react';

interface ControlPanelProps {
  currentMode: string;
  pumpStatus: boolean;
  onModeChange: (mode: string) => void;
}

export function ControlPanel({ currentMode, pumpStatus, onModeChange }: ControlPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Operation Mode</h4>
          <div className="flex space-x-2">
            <Button
              variant={currentMode === 'auto' ? 'default' : 'outline'}
              onClick={() => onModeChange('auto')}
              className="flex-1"
            >
              <Sprout className="w-4 h-4 mr-2" />
              Auto
            </Button>
            <Button
              variant={currentMode === 'manual' ? 'default' : 'outline'}
              onClick={() => onModeChange('manual')}
              className="flex-1"
            >
              <Settings className="w-4 h-4 mr-2" />
              Manual
            </Button>
          </div>
        </div>

        {currentMode === 'manual' && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Manual Control</h4>
            <div className="flex space-x-2">
              <Button
                variant={pumpStatus ? 'default' : 'outline'}
                onClick={() => {/* Handle pump on */}}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Turn On
              </Button>
              <Button
                variant={!pumpStatus ? 'default' : 'outline'}
                onClick={() => {/* Handle pump off */}}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Turn Off
              </Button>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            {currentMode === 'auto' 
              ? 'System is operating automatically based on sensor readings' 
              : 'Manual control mode active. You can manually operate the pump.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
