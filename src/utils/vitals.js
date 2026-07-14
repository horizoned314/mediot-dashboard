import { ALERT_THRESHOLDS } from '../config';

/**
 * Menentukan apakah data pasien memicu kondisi ALERT.
 * @param {object|null} data - Payload dari MQTT / API
 * @returns {boolean}
 */
export function isAlert(data) {
  if (!data) return false;
  if (data.status_alat === 'ERROR') return true;
  if (typeof data.spo2 === 'number' && data.spo2 < ALERT_THRESHOLDS.spo2Min) return true;
  if (typeof data.suhu === 'number' && data.suhu > ALERT_THRESHOLDS.suhuMax) return true;
  return false;
}

/**
 * Mengembalikan label + warna status berdasarkan status_alat
 */
export function getStatusBadge(status_alat) {
  switch (status_alat) {
    case 'OK':    return { label: 'OK',    cls: 'badge-ok'   };
    case 'ERROR': return { label: 'ERROR', cls: 'badge-err'  };
    default:      return { label: status_alat ?? '–', cls: 'badge-warn' };
  }
}

/**
 * Format ISO timestamp ke waktu lokal yang mudah dibaca
 */
export function formatTime(isoOrMs) {
  if (!isoOrMs) return '–';
  const d = typeof isoOrMs === 'number' ? new Date(isoOrMs) : new Date(isoOrMs);
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function formatDateTime(isoOrMs) {
  if (!isoOrMs) return '–';
  const d = typeof isoOrMs === 'number' ? new Date(isoOrMs) : new Date(isoOrMs);
  return d.toLocaleString('id-ID', {
    day:    '2-digit', month: 'short', year: 'numeric',
    hour:   '2-digit', minute: '2-digit', second: '2-digit',
  });
}

/**
 * Warna untuk setiap metrik vital
 */
export const VITAL_COLORS = {
  bpm:  '#ef4444',
  spo2: '#3b82f6',
  suhu: '#f97316',
};
