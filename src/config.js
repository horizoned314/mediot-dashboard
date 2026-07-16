// src/config.js (Sinkron dengan Settings.jsx Anda)
export const MQTT_CONFIG = {
  get host() {
    return localStorage.getItem('mqtt_host') || 'localhost';
  },
  get port() {
    return localStorage.getItem('mqtt_port') || 9001;
  },
  get topic() {
    return localStorage.getItem('mqtt_topic') || 'healthcare/patient/vitals';
  },
  clientIdPrefix: 'medical-dashboard',
};

export const API_CONFIG = {
  get baseURL() {
    return localStorage.getItem('api_base') || 'http://localhost:8000';
  },
  historyEndpoint: '/api/v1/history',
};

export const ALERT_THRESHOLDS = {
  spo2Min: 95,
  suhuMax: 38.0,
};

export const CHART_WINDOW = Number(localStorage.getItem('chart_window')) || 30;