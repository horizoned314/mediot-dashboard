// Konfigurasi default MQTT & API
// Tim B wajib menyesuaikan HOST & PORT sesuai server mereka

export const MQTT_CONFIG = {
  host: 'localhost',
  port: 9001,          // WebSocket port Mosquitto
  topic: 'healthcare/patient/vitals',
  clientIdPrefix: 'medical-dashboard',
};

export const API_CONFIG = {
  baseURL: 'http://localhost:8000',   // URL FastAPI Tim B
  historyEndpoint: '/api/v1/history', // + /{id_pasien}?limit=50
};

// Threshold untuk Visual Alert
export const ALERT_THRESHOLDS = {
  spo2Min: 95,      // SpO2 < 95 → ALERT
  suhuMax: 38.0,    // Suhu > 38.0 → ALERT
};

// Jumlah titik data yang ditampilkan di live chart
export const CHART_WINDOW = 30;
