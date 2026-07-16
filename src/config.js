// Konfigurasi Dinamis MQTT & API (Terhubung otomatis ke Halaman Pengaturan)
// Tim B wajib menyesuaikan HOST & PORT default sesuai server mereka

export const MQTT_CONFIG = {
  get host() {
    return localStorage.getItem('custom_mqtt_host') || 'localhost';
  },
  get port() {
    return localStorage.getItem('custom_mqtt_port') || 9001;
  },
  get topic() {
    return localStorage.getItem('custom_mqtt_topic') || 'healthcare/patient/vitals';
  },
  clientIdPrefix: 'medical-dashboard',
};

export const API_CONFIG = {
  get baseURL() {
    // Otomatis membaca dari Halaman Pengaturan, fallback ke localhost jika kosong
    return localStorage.getItem('custom_api_url') || 'http://localhost:8000';
  },
  historyEndpoint: '/api/v1/history', // Penggunaan: + /{id_pasien}?limit=50
};

// Threshold untuk Visual Alert
export const ALERT_THRESHOLDS = {
  spo2Min: 95,      // SpO2 < 95 → ALERT
  suhuMax: 38.0,    // Suhu > 38.0 → ALERT
};

// Jumlah titik data yang ditampilkan di live chart
export const CHART_WINDOW = 30;