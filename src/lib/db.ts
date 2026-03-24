import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log("executed query", { text, duration, rows: res.rowCount });
  return res;
}

export async function getUserByUsername(username: string) {
  const result = await query("SELECT * FROM users WHERE username = $1", [username]);
  return result.rows[0];
}

export async function getUserById(id: number) {
  const result = await query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
}

export async function createUser(username: string, password: string) {
  const result = await query(
    "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
    [username, password]
  );
  return result.rows[0];
}

export async function getSensorReadings(limit: number = 50) {
  const result = await query(
    "SELECT * FROM sensor_readings ORDER BY timestamp DESC LIMIT $1",
    [limit]
  );
  return result.rows;
}

export async function getLatestSensorReading() {
  const result = await query(
    "SELECT * FROM sensor_readings ORDER BY timestamp DESC LIMIT 1"
  );
  return result.rows[0];
}

export async function getAIRecommendations(limit: number = 10) {
  const result = await query(
    "SELECT * FROM ai_recommendations ORDER BY created_at DESC LIMIT $1",
    [limit]
  );
  return result.rows;
}

export async function getSystemLogs(limit: number = 50) {
  const result = await query(
    "SELECT * FROM system_logs ORDER BY timestamp DESC LIMIT $1",
    [limit]
  );
  return result.rows;
}

export async function getSystemSettings() {
  const result = await query("SELECT * FROM system_settings");
  const settings: Record<string, string> = {};
  result.rows.forEach((row: any) => {
    settings[row.key] = row.value;
  });
  return settings;
}
