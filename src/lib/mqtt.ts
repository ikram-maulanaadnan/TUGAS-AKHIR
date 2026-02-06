"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { SensorReading, SystemLog, SystemStatus, SystemSettings } from "@/types/sensor-data";

// MQTT Configuration types
export type MQTTConfig = {
  brokerUrl: string;
  clientId: string;
  username?: string;
  password?: string;
  topics: {
    sensorReadings: string;
    systemLogs: string;
    systemStatus: string;
    settings: string;
    commands: string;
  };
};

// Default MQTT configuration
export const defaultMQTTConfig: MQTTConfig = {
  brokerUrl: "ws://broker.hivemq.com:8000/mqtt",
  clientId: `esp-dashboard-${Math.random().toString(16).slice(2, 10)}`,
  topics: {
    sensorReadings: "esp/sensors/readings",
    systemLogs: "esp/system/logs",
    systemStatus: "esp/system/status",
    settings: "esp/system/settings",
    commands: "esp/system/commands",
  },
};

// Message handlers type
type MessageHandlers = {
  onSensorReading: (reading: SensorReading) => void;
  onSystemLog: (log: SystemLog) => void;
  onSystemStatus: (status: SystemStatus) => void;
  onSettings: (settings: SystemSettings) => void;
  onConnectionChange: (connected: boolean) => void;
  onError: (error: string) => void;
};

export function useMQTT(config: MQTTConfig, handlers: MessageHandlers) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const clientRef = useRef<any>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(async () => {
    try {
      // Dynamic import to avoid SSR issues
      const mqtt = await import("mqtt");

      const options: any = {
        clientId: config.clientId,
        clean: true,
        reconnectPeriod: 5000,
        connectTimeout: 30000,
        keepalive: 60,
      };

      if (config.username) {
        options.username = config.username;
      }
      if (config.password) {
        options.password = config.password;
      }

      const client = mqtt.connect(config.brokerUrl, options);
      clientRef.current = client;

      client.on("connect", () => {
        console.log("MQTT Connected");
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttempts.current = 0;
        handlers.onConnectionChange(true);

        // Subscribe to all topics
        Object.values(config.topics).forEach((topic) => {
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
        try {
          const payload = JSON.parse(message.toString());

          switch (topic) {
            case config.topics.sensorReadings:
              handlers.onSensorReading(payload as SensorReading);
              break;
            case config.topics.systemLogs:
              handlers.onSystemLog(payload as SystemLog);
              break;
            case config.topics.systemStatus:
              handlers.onSystemStatus(payload as SystemStatus);
              break;
            case config.topics.settings:
              handlers.onSettings(payload as SystemSettings);
              break;
            default:
              console.log("Unknown topic:", topic);
          }
        } catch (error) {
          console.error("Error parsing MQTT message:", error);
        }
      });

      client.on("error", (error: any) => {
        console.error("MQTT Error:", error);
        setConnectionError(error.message);
        handlers.onError(error.message);
      });

      client.on("close", () => {
        console.log("MQTT Disconnected");
        setIsConnected(false);
        handlers.onConnectionChange(false);
      });

      client.on("offline", () => {
        console.log("MQTT Offline");
        setIsConnected(false);
        handlers.onConnectionChange(false);
      });

      client.on("reconnect", () => {
        reconnectAttempts.current++;
        console.log(`MQTT Reconnecting... Attempt ${reconnectAttempts.current}`);
        if (reconnectAttempts.current >= maxReconnectAttempts) {
          client.end();
          setConnectionError("Max reconnection attempts reached");
        }
      });
    } catch (error: any) {
      console.error("MQTT Connection error:", error);
      setConnectionError(error.message);
      handlers.onError(error.message);
    }
  }, [config, handlers]);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.end();
      clientRef.current = null;
    }
  }, []);

  const publish = useCallback(
    (topic: string, message: any) => {
      if (clientRef.current && isConnected) {
        const payload = typeof message === "string" ? message : JSON.stringify(message);
        clientRef.current.publish(topic, payload, (err: any) => {
          if (err) {
            console.error(`Failed to publish to ${topic}:`, err);
          }
        });
      }
    },
    [isConnected]
  );

  const sendCommand = useCallback(
    (command: string, payload: any) => {
      publish(config.topics.commands, { command, ...payload });
    },
    [publish, config.topics.commands]
  );

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    connectionError,
    publish,
    sendCommand,
    reconnect: connect,
    disconnect,
  };
}

// Hook for managing MQTT configuration
export function useMQTTConfig() {
  const [config, setConfig] = useState<MQTTConfig>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mqttConfig");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return defaultMQTTConfig;
        }
      }
    }
    return defaultMQTTConfig;
  });

  useEffect(() => {
    localStorage.setItem("mqttConfig", JSON.stringify(config));
  }, [config]);

  const updateConfig = useCallback((updates: Partial<MQTTConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(defaultMQTTConfig);
  }, []);

  return { config, updateConfig, resetConfig };
}
