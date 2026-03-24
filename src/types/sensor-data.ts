export type SensorReading = {
  id: number;
  timestamp: string;
  temperature: number;
  soilMoisture: number;
  pumpStatus: boolean;
  systemMode: string;
};

export type SystemLog = {
  id: number;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'pump_action';
  message: string;
  metadata: string | null;
};

export type SystemStatus = {
  mqtt: 'connected' | 'disconnected';
  sensors: 'active' | 'inactive';
  database: 'connected' | 'disconnected';
  lastReading: string;
};

export type SystemSettings = {
  systemMode: 'auto' | 'manual';
  manualPumpState: 'on' | 'off';
  moistureThreshold: number;
  temperatureThreshold: number;
  plantDescription: string;
};

export type Alert = {
  id: number;
  timestamp: string;
  type: 'warning' | 'error';
  message: string;
  severity: 'low' | 'medium' | 'high';
};
