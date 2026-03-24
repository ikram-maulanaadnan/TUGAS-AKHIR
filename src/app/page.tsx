"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { queryClient } from "@/lib/queryClient";
import { MetricCard } from "@/components/metric-card";
import { EnvironmentalChart } from "@/components/environmental-chart";
import { PumpChart } from "@/components/pump-chart";
import { ControlPanel } from "@/components/control-panel";
import { SystemStatusComponent } from "@/components/system-status";
import { RecentActivities } from "@/components/recent-activities";
import { SettingsPanel } from "@/components/settings-panel";
import { TestDataButton } from "@/components/test-data-button";
import { AIRecommendations } from "@/components/ai-recommendations";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Thermometer, Droplets, Waves, Settings, Sprout, AlertTriangle, LogOut, User, Wifi, WifiOff, LayoutDashboard, BarChart3, List, Database, Cog, MessageSquare } from "lucide-react";
import type { SensorReading, SystemLog, SystemStatus, Alert as AlertType, SystemSettings } from "@/types/sensor-data";
import { useAuth } from "@/lib/auth";

// MQTT Topics configuration
const MQTT_TOPICS = {
  sensorReadings: "esp/sensors/readings",
  systemLogs: "esp/system/logs",
  systemStatus: "esp/system/status",
  settings: "esp/system/settings",
  commands: "esp/system/commands",
};

function DashboardContent() {
  const { isLoggedIn, username, logout } = useAuth();
  const router = useRouter();

  // State for sensor data
  const [latestReading, setLatestReading] = useState<SensorReading | null>(null);
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [currentMode, setCurrentMode] = useState<string>("auto");
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [activePage, setActivePage] = useState<string>("dashboard");
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  // MQTT connection state
  const [isMQTTConnected, setIsMQTTConnected] = useState(false);
  const [mqttError, setMqttError] = useState<string | null>(null);
  const clientRef = useRef<any>(null);
  const reconnectAttempts = useRef(0);

  // Maximum readings to keep in history
  const MAX_READINGS = 50;

  // Navigation menu items based on ERD entities
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "logs", label: "System Logs", icon: List },
    { id: "data", label: "Sensor Data", icon: Database },
    { id: "settings", label: "Settings", icon: Cog },
    { id: "ai-recommendations", label: "AI Recommendations", icon: MessageSquare },
  ];

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  // MQTT Handlers
  const handleSensorReading = useCallback((reading: SensorReading) => {
    setLatestReading(reading);
    setReadings((prev) => {
      const updated = [reading, ...prev];
      return updated.slice(0, MAX_READINGS);
    });
  }, []);

  const handleSystemLog = useCallback((log: SystemLog) => {
    setSystemLogs((prev) => {
      const updated = [log, ...prev];
      return updated.slice(0, 100);
    });
  }, []);

  const handleSystemStatus = useCallback((status: SystemStatus) => {
    setSystemStatus(status);
  }, []);

  const handleSettings = useCallback((settings: SystemSettings) => {
    setSettings(settings);
    if (settings.systemMode) {
      setCurrentMode(settings.systemMode);
    }
  }, []);

  const handleSaveSettings = async (newSettings: SystemSettings) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (response.ok) {
        const updatedSettings = await response.json();
        setSettings(updatedSettings);
        setShowSettings(false);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleConnectionChange = useCallback((connected: boolean) => {
    setIsMQTTConnected(connected);
    setMqttError(null);
    reconnectAttempts.current = 0;
  }, []);

  const handleError = useCallback((error: string) => {
    setMqttError(error);
  }, []);

  // Initialize MQTT connection
  useEffect(() => {
    if (!isLoggedIn) return;

    let isMounted = true;

    const connectMQTT = async () => {
      try {
        const mqttModule = await import("mqtt");
        const mqtt = mqttModule.default || mqttModule;

        // Use WebSocket connection for browser
        const brokerUrl = "ws://broker.hivemq.com:8000/mqtt";
        const clientId = `esp-dashboard-${Math.random().toString(16).slice(2, 10)}`;

        const options = {
          clientId,
          clean: true,
          reconnectPeriod: 5000,
          connectTimeout: 30000,
          keepalive: 60,
        };

        const client = mqtt.connect(brokerUrl, options);
        clientRef.current = client;

        client.on("connect", () => {
          if (!isMounted) return;
          console.log("MQTT Connected");
          setIsMQTTConnected(true);
          setMqttError(null);
          reconnectAttempts.current = 0;

          // Subscribe to all topics
          Object.values(MQTT_TOPICS).forEach((topic) => {
            client.subscribe(topic, (err: any) => {
              if (err) {
                console.error(`Failed to subscribe to ${topic}:`, err);
              } else {
                console.log(`Subscribed to ${topic}`);
              }
            });
          });
        });

        client.on("message", (topic: string, message: Buffer) => {
          if (!isMounted) return;
          try {
            const payload = JSON.parse(message.toString());

            switch (topic) {
              case MQTT_TOPICS.sensorReadings:
                handleSensorReading(payload as SensorReading);
                break;
              case MQTT_TOPICS.systemLogs:
                handleSystemLog(payload as SystemLog);
                break;
              case MQTT_TOPICS.systemStatus:
                handleSystemStatus(payload as SystemStatus);
                break;
              case MQTT_TOPICS.settings:
                handleSettings(payload as SystemSettings);
                break;
              default:
                console.log("Unknown topic:", topic);
            }
          } catch (error) {
            console.error("Error parsing MQTT message:", error);
          }
        });

        client.on("error", (error: any) => {
          if (!isMounted) return;
          console.error("MQTT Error:", error);
          setMqttError(error.message);
        });

        client.on("close", () => {
          if (!isMounted) return;
          console.log("MQTT Disconnected");
          setIsMQTTConnected(false);
        });

        client.on("offline", () => {
          if (!isMounted) return;
          console.log("MQTT Offline");
          setIsMQTTConnected(false);
        });

        client.on("reconnect", () => {
          if (!isMounted) return;
          reconnectAttempts.current++;
          console.log(`MQTT Reconnecting... Attempt ${reconnectAttempts.current}`);
          if (reconnectAttempts.current >= 5) {
            client.end();
            setMqttError("Max reconnection attempts reached");
          }
        });
      } catch (error: any) {
        if (isMounted) {
          console.error("MQTT Connection error:", error);
          setMqttError(error.message);
        }
      }
    };

    connectMQTT();

    return () => {
      isMounted = false;
      if (clientRef.current) {
        clientRef.current.end();
      }
    };
  }, [handleSensorReading, handleSystemLog, handleSystemStatus, handleSettings, isLoggedIn]);

  // Send command via MQTT
  const sendCommand = useCallback((command: string, payload: any) => {
    if (clientRef.current && isMQTTConnected) {
      const message = JSON.stringify({ command, ...payload, timestamp: new Date().toISOString() });
      clientRef.current.publish(MQTT_TOPICS.commands, message, (err: any) => {
        if (err) {
          console.error("Failed to send command:", err);
        }
      });
    }
  }, [isMQTTConnected]);

  const getTemperatureStatus = (temp: number) => {
    if (temp > 30) return { label: "High", variant: "destructive" as const, color: "bg-red-100" };
    if (temp < 15) return { label: "Low", variant: "outline" as const, color: "bg-blue-100" };
    return { label: "Normal", variant: "default" as const, color: "bg-green-100" };
  };

  const getMoistureStatus = (moisture: number) => {
    if (moisture < 40) return { label: "Low", variant: "destructive" as const, color: "bg-red-100" };
    if (moisture < 60) return { label: "Medium", variant: "outline" as const, color: "bg-yellow-100" };
    return { label: "Good", variant: "default" as const, color: "bg-green-100" };
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const temperature = latestReading?.temperature || 0;
  const soilMoisture = latestReading?.soilMoisture || 0;
  const pumpStatus = latestReading?.pumpStatus || false;
  const lastUpdate = latestReading?.timestamp ? formatTime(latestReading.timestamp) : "--:--:--";

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg border-r border-gray-200 fixed h-full">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Sprout className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Smart Irrigation</h1>
                <p className="text-xs text-gray-500">IoT Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-green-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User section in sidebar */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{username}</p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => logout()}
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {navItems.find((item) => item.id === activePage)?.label || "Dashboard"}
                </h2>
                <p className="text-sm text-gray-500">Real-time Agricultural Monitoring</p>
              </div>
              <div className="flex items-center space-x-4">
                <TestDataButton />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  className="flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Button>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${isMQTTConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {isMQTTConnected ? "MQTT Connected" : "MQTT Disconnected"}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Last Updated: <span className="font-medium">{lastUpdate}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* MQTT Error Alert */}
        {mqttError && (
          <Alert className="mb-6 border-l-4 border-red-400 bg-red-50">
            <WifiOff className="h-4 w-4" />
            <AlertDescription>MQTT Error: {mqttError}</AlertDescription>
          </Alert>
        )}

        {/* Alert Banners */}
        {alerts.map((alert, index) => (
          <Alert key={index} className="mb-6 border-l-4 border-yellow-400">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        ))}

        {/* Connection Status Bar */}
        <div className="mb-6 flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {isMQTTConnected ? (
                <Wifi className="h-5 w-5 text-green-500" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-500" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {isMQTTConnected ? "Connected to MQTT Broker" : "Reconnecting..."}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Topic: <code className="bg-gray-100 px-2 py-1 rounded">{MQTT_TOPICS.sensorReadings}</code>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {readings.length} readings stored | {systemLogs.length} logs
          </div>
        </div>

        {/* Real-time Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Temperature"
            value={temperature.toFixed(1)}
            unit="°C"
            status={getTemperatureStatus(temperature)}
            icon={<Thermometer className="text-red-600 text-xl" />}
            updatedAt={`Updated ${latestReading ? "now" : "never"}`}
          />

          <MetricCard
            title="Soil Moisture"
            value={soilMoisture.toString()}
            unit="%"
            status={getMoistureStatus(soilMoisture)}
            icon={<Droplets className="text-green-600 text-xl" />}
            updatedAt={`Updated ${latestReading ? "now" : "never"}`}
          >
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-yellow-400 to-green-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${soilMoisture}%` }}
              />
            </div>
          </MetricCard>

          <MetricCard
            title="Water Pump"
            value={pumpStatus ? "ON" : "OFF"}
            status={{
              label: pumpStatus ? "Active" : "Inactive",
              variant: pumpStatus ? "default" : "outline",
              color: pumpStatus ? "bg-green-100" : "bg-gray-100",
            }}
            icon={<Waves className="text-blue-600 text-xl" />}
            updatedAt={`Updated ${latestReading ? "now" : "never"}`}
          >
            <div
              className={`w-6 h-6 ${pumpStatus ? "bg-green-500 animate-pulse" : "bg-gray-400"} rounded-full flex items-center justify-center`}
            >
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </MetricCard>

          <MetricCard
            title="System Mode"
            value={currentMode.toUpperCase()}
            status={{
              label: "Active",
              variant: "default",
              color: "bg-green-100",
            }}
            icon={<Settings className="text-green-600 text-xl" />}
            updatedAt="Real-time"
          />
        </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Charts Section */}
           <div className="lg:col-span-2 space-y-8">
             <EnvironmentalChart data={readings} latestReading={latestReading} />
             <PumpChart data={readings} latestReading={latestReading} />
           </div>

           {/* Control Panel and AI Recommendations */}
           <div className="space-y-6">
             <ControlPanel currentMode={currentMode} pumpStatus={pumpStatus} onModeChange={setCurrentMode} />
             <SystemStatusComponent status={systemStatus} />
             <AIRecommendations />
             <RecentActivities logs={systemLogs} />
           </div>
         </div>

        {/* Settings Panel */}
        <SettingsPanel settings={settings} isVisible={showSettings} onClose={() => setShowSettings(false)} onSave={handleSaveSettings} />
      </main>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent />
    </QueryClientProvider>
  );
}
