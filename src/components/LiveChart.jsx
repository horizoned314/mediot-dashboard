import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine,
} from 'recharts';
import { formatTime } from '../utils/vitals';
import { VITAL_META } from './VitalCard';
import { useState } from 'react';

const CustomTooltip = ({ active, payload, unit, color }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(10,22,40,0.92)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '10px', padding: '10px 14px',
      backdropFilter: 'blur(16px)', fontSize: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    }}>
      <div style={{ color: 'rgba(148,163,184,0.5)', marginBottom: '5px', fontSize: '10px' }}>{payload[0]?._label}</div>
      <div style={{ color, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', fontSize: '15px' }}>
        {payload[0]?.value} <span style={{ fontWeight: 400, fontSize: '11px', color: 'rgba(148,163,184,0.5)' }}>{unit}</span>
      </div>
    </div>
  );
};

/**
 * LiveChart – area chart with pause/resume button.
 * Props: data, dataKey, refLine, isPaused (boolean), onTogglePause
 */
export default function LiveChart({ data, dataKey, refLine }) {
  const [isPaused, setIsPaused] = useState(false);
  const [frozenData, setFrozenData] = useState([]);

  const meta    = VITAL_META[dataKey];
  const color   = meta?.color || '#60a5fa';
  const unit    = meta?.unit  || '';
  const gradId  = `grad-${dataKey}`;

  // When unpausing, release frozen data
  const displayData = isPaused ? frozenData : data;
  const lastVal     = displayData.length > 0 ? displayData[displayData.length - 1]?.[dataKey] : null;

  const chartData = displayData.map(d => ({
    ...d,
    _label: formatTime(d._ts),
  }));

  function togglePause() {
    if (!isPaused) {
      // Freeze current snapshot
      setFrozenData([...data]);
    }
    setIsPaused(p => !p);
  }

  return (
    <div className="glass-card" style={{ padding: '14px 14px 10px', borderColor: `${color}18` }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '0 2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div style={{ width: 24, height: 24, borderRadius: '7px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
            {meta?.icon}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '12px', color: '#f1f5f9' }}>{meta?.label}</div>
            <div style={{ fontSize: '9px', color: 'rgba(148,163,184,0.4)' }}>{unit}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="mono" style={{ fontSize: '18px', fontWeight: 800, color, letterSpacing: '-0.5px' }}>
            {lastVal ?? '–'}
          </div>
          {/* Pause button */}
          <button
            onClick={togglePause}
            title={isPaused ? 'Resume chart' : 'Pause chart'}
            style={{
              width: 24, height: 24, borderRadius: '6px',
              background: isPaused ? `${color}20` : 'rgba(255,255,255,0.05)',
              border: `1px solid ${isPaused ? color + '40' : 'rgba(255,255,255,0.08)'}`,
              color: isPaused ? color : 'rgba(148,163,184,0.4)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', transition: 'all 0.2s',
              padding: 0,
            }}
          >
            {isPaused ? (
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
            ) : (
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* Paused badge */}
      {isPaused && (
        <div style={{
          marginBottom: '6px', padding: '3px 10px', borderRadius: '99px',
          background: `${color}12`, border: `1px solid ${color}25`,
          fontSize: '9px', fontWeight: 700, color, letterSpacing: '0.08em',
          textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '5px',
        }}>
          <span>⏸</span> PAUSED — klik ▶ untuk lanjut
        </div>
      )}

      {/* Chart */}
      <ResponsiveContainer width="100%" height={100}>
        <AreaChart data={chartData} margin={{ top: 2, right: 2, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={color} stopOpacity={isPaused ? 0.08 : 0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="_label" tick={{ fontSize: 8, fill: 'rgba(148,163,184,0.3)', fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 8, fill: 'rgba(148,163,184,0.3)', fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={false} width={32} />
          <Tooltip content={<CustomTooltip unit={unit} color={color} />} cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4' }} />
          {refLine && (
            <ReferenceLine y={refLine.value} stroke="rgba(239,68,68,0.4)" strokeDasharray="4 3"
              label={{ value: refLine.label, fill: 'rgba(239,68,68,0.6)', fontSize: 8, position: 'insideTopRight' }}
            />
          )}
          <Area
            type="monotone" dataKey={dataKey}
            stroke={isPaused ? `${color}60` : color}
            strokeWidth={isPaused ? 1.5 : 2}
            fill={`url(#${gradId})`}
            dot={false}
            activeDot={{ r: 4, fill: color, strokeWidth: 2, stroke: '#050b14' }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
