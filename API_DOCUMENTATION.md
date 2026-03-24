# IoT Monitoring Dashboard API Documentation

This document provides documentation for all API endpoints available in the IoT Monitoring Dashboard application. The API is built using Next.js 16 App Router and follows RESTful principles.

---

## Base URL

All API endpoints are relative to the base URL:
```
http://localhost:3000/api/
```

In production, this would be your deployed domain.

---

## Authentication

The API uses simple username/password authentication for login. Once authenticated, user information is stored in a database.

### Endpoint: `/api/login`

**Method: POST**

Authenticate user and get user information.

#### Request Body:
```json
{
  "username": "string",
  "password": "string"
}
```

#### Response:
**Success (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "number",
    "username": "string",
    "created_at": "string"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing username or password
- `401 Unauthorized`: Invalid username or password
- `500 Internal Server Error`: Server side error

#### Example:
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

---

## Sensor Readings

### Endpoint: `/api/sensor-readings`

**Method: GET**

Get sensor readings data (returns last 10 readings).

#### Response:
**Success (200 OK):**
```json
[
  {
    "id": "number",
    "timestamp": "string (ISO-8601)",
    "temperature": "number (Celsius)",
    "soilMoisture": "number (percentage)",
    "pumpStatus": "boolean",
    "systemMode": "string"
  },
  ...
]
```

**Error Response:**
- `500 Internal Server Error`: Server side error

#### Example:
```bash
curl -X GET http://localhost:3000/api/sensor-readings
```

---

### Endpoint: `/api/sensor-readings`

**Method: POST**

Add a new sensor reading.

#### Request Body:
```json
{
  "temperature": "number (required)",
  "soilMoisture": "number (required)",
  "pumpStatus": "boolean (required)",
  "systemMode": "string (required)"
}
```

#### Response:
**Success (200 OK):**
```json
{
  "id": "number (timestamp)",
  "timestamp": "string (ISO-8601)",
  "temperature": "number",
  "soilMoisture": "number",
  "pumpStatus": "boolean",
  "systemMode": "string"
}
```

**Error Response:**
- `500 Internal Server Error`: Server side error

#### Example:
```bash
curl -X POST http://localhost:3000/api/sensor-readings \
  -H "Content-Type: application/json" \
  -d '{
    "temperature": 25.5,
    "soilMoisture": 60,
    "pumpStatus": false,
    "systemMode": "auto"
  }'
```

---

## System Status

### Endpoint: `/api/system-status`

**Method: GET**

Get system status information.

#### Response:
**Success (200 OK):**
```json
{
  "mqtt": "string (connected/disconnected)",
  "sensors": "string (active/inactive)",
  "database": "string (connected/disconnected)",
  "lastReading": "string (ISO-8601)"
}
```

**Error Response:**
- `500 Internal Server Error`: Server side error

#### Example:
```bash
curl -X GET http://localhost:3000/api/system-status
```

---

## System Settings

### Endpoint: `/api/settings`

**Method: GET**

Get system settings.

#### Response:
**Success (200 OK):**
```json
{
  "systemMode": "string (auto/manual)",
  "manualPumpState": "string (on/off)",
  "moistureThreshold": "number (percentage)",
  "temperatureThreshold": "number (Celsius)"
}
```

**Error Response:**
- `500 Internal Server Error`: Server side error

#### Example:
```bash
curl -X GET http://localhost:3000/api/settings
```

---

### Endpoint: `/api/settings`

**Method: POST**

Update system settings.

#### Request Body:
```json
{
  "systemMode": "string (optional, auto/manual)",
  "manualPumpState": "string (optional, on/off)",
  "moistureThreshold": "number (optional)",
  "temperatureThreshold": "number (optional)"
}
```

#### Response:
**Success (200 OK):**
```json
{
  "systemMode": "string",
  "manualPumpState": "string",
  "moistureThreshold": "number",
  "temperatureThreshold": "number"
}
```

**Error Response:**
- `500 Internal Server Error`: Server side error

#### Example:
```bash
curl -X POST http://localhost:3000/api/settings \
  -H "Content-Type: application/json" \
  -d '{
    "systemMode": "manual",
    "manualPumpState": "on",
    "moistureThreshold": 45,
    "temperatureThreshold": 32
  }'
```

---

## System Logs

### Endpoint: `/api/system-logs`

**Method: GET**

Get system logs (returns last 5 logs).

#### Response:
**Success (200 OK):**
```json
[
  {
    "id": "number",
    "timestamp": "string (ISO-8601)",
    "type": "string (info/warning/error/pump_action)",
    "message": "string",
    "metadata": "string (JSON stringified)"
  },
  ...
]
```

**Error Response:**
- `500 Internal Server Error`: Server side error

#### Example:
```bash
curl -X GET http://localhost:3000/api/system-logs
```

---

### Endpoint: `/api/system-logs`

**Method: POST**

Add a new system log entry.

#### Request Body:
```json
{
  "type": "string (required, info/warning/error/pump_action)",
  "message": "string (required)",
  "metadata": "string (optional, JSON stringified)"
}
```

#### Response:
**Success (200 OK):**
```json
{
  "id": "number (timestamp)",
  "timestamp": "string (ISO-8601)",
  "type": "string",
  "message": "string",
  "metadata": "string"
}
```

**Error Response:**
- `500 Internal Server Error`: Server side error

#### Example:
```bash
curl -X POST http://localhost:3000/api/system-logs \
  -H "Content-Type: application/json" \
  -d '{
    "type": "warning",
    "message": "Soil moisture below threshold",
    "metadata": "{\"sensorId\": \"sensor_1\"}"
  }'
```

---

## AI Recommendations

### Endpoint: `/api/ai-recommendations`

**Method: GET**

Get AI recommendations based on sensor data.

#### Query Parameters:
- `limit` (optional): Number of recommendations to return (default: 10)

#### Response:
**Success (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "number",
      "timestamp": "string (ISO-8601)",
      "type": "string",
      "message": "string",
      "confidence": "number",
      "metadata": "string (JSON stringified)"
    },
    ...
  ]
}
```

**Error Response:**
- `500 Internal Server Error`: Server side error

#### Example:
```bash
# Get 5 recommendations
curl -X GET "http://localhost:3000/api/ai-recommendations?limit=5"

# Get default 10 recommendations
curl -X GET http://localhost:3000/api/ai-recommendations
```

---

## Test Data Generation

### Endpoint: `/api/test-data`

**Method: POST**

Generate and log test sensor data and system log.

#### Request Body:
None

#### Response:
**Success (200 OK):**
```json
{
  "success": true,
  "message": "Test data generated successfully"
}
```

**Error Response:**
- `500 Internal Server Error`: Server side error

#### Example:
```bash
curl -X POST http://localhost:3000/api/test-data
```

---

## Response Formats

### Success Responses

All successful API responses follow this format:

```json
{
  "success": true,
  "data": "any (or array)"
}
```

or for simpler endpoints:

```json
"any (or array)"
```

### Error Responses

All error responses follow this format:

```json
{
  "error": "string"
}
```

With appropriate HTTP status codes (400, 401, 500).

---

## Data Types Reference

### SensorReading
```typescript
{
  id: number;
  timestamp: string; // ISO-8601 format
  temperature: number; // Celsius
  soilMoisture: number; // Percentage (0-100)
  pumpStatus: boolean; // true = on, false = off
  systemMode: string; // "auto" or "manual"
}
```

### SystemLog
```typescript
{
  id: number;
  timestamp: string; // ISO-8601 format
  type: 'info' | 'warning' | 'error' | 'pump_action';
  message: string;
  metadata: string | null; // JSON stringified
}
```

### SystemStatus
```typescript
{
  mqtt: 'connected' | 'disconnected';
  sensors: 'active' | 'inactive';
  database: 'connected' | 'disconnected';
  lastReading: string; // ISO-8601 format
}
```

### SystemSettings
```typescript
{
  systemMode: 'auto' | 'manual';
  manualPumpState: 'on' | 'off';
  moistureThreshold: number; // Percentage (0-100)
  temperatureThreshold: number; // Celsius
}
```

---

## Usage Examples

### JavaScript/TypeScript (Fetch API)

```javascript
// Get sensor readings
async function getSensorReadings() {
  try {
    const response = await fetch('/api/sensor-readings');
    const data = await response.json();
    console.log('Sensor readings:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Update system settings
async function updateSettings(newSettings) {
  try {
    const response = await fetch('/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSettings),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update settings');
    }
    
    const data = await response.json();
    console.log('Updated settings:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### Python (Requests Library)

```python
import requests

# Get sensor readings
response = requests.get('http://localhost:3000/api/sensor-readings')
if response.status_code == 200:
    data = response.json()
    print('Sensor readings:', data)

# Update system settings
settings_data = {
    'systemMode': 'manual',
    'manualPumpState': 'on',
    'moistureThreshold': 45,
    'temperatureThreshold': 32
}

response = requests.post(
    'http://localhost:3000/api/settings',
    json=settings_data
)

if response.status_code == 200:
    data = response.json()
    print('Updated settings:', data)
```

---

## Error Handling

### Common Error Codes

- `400 Bad Request`: Invalid request parameters or missing fields
- `401 Unauthorized`: Invalid credentials or unauthenticated
- `500 Internal Server Error`: Server-side error

### Retry Logic

For critical operations, implement retry logic with exponential backoff:

```javascript
async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('Request failed');
    return response.json();
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
}
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production environments, consider adding:

1. API key authentication
2. Rate limiting per IP address
3. Request throttling

---

## CORS Configuration

The API includes CORS (Cross-Origin Resource Sharing) configuration to allow requests from the front-end application. By default, it allows:

- Requests from the same origin
- Common HTTP methods (GET, POST)
- Standard headers

---

## Versioning

This is API version 1.0. For future changes, consider implementing versioning:

```
/api/v1/sensor-readings
/api/v2/sensor-readings
```

This ensures backward compatibility for existing clients.
