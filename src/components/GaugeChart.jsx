/**
 * GaugeChart – SVG speedometer simetris 3/4 circle (270° sweep).
 * Arc dari pojok kiri-bawah (225°) ke kanan-bawah (315°) searah jarum jam.
 */
export default function GaugeChart({
  value, min = 0, max = 100,
  color = '#60a5fa',
  label, unit,
  dangerMin, dangerMax,
  size = 160,
}) {
  const CX     = size / 2;
  const CY     = size / 2;
  const R      = size * 0.36;
  const SW     = size * 0.072;  // stroke width

  // Arc: 270° sweep, dari 225° ke 315° (searah jarum jam)
  const ARC_START = 225;
  const ARC_TOTAL = 270;
  const ARC_END   = ARC_START + ARC_TOTAL;  // 495°

  // Konversi angle (0° = atas/north di polar) ke koordinat SVG
  function polar(deg) {
    const rad = ((deg - 90) * Math.PI) / 180;
    return {
      x: CX + R * Math.cos(rad),
      y: CY + R * Math.sin(rad),
    };
  }

  // Buat path arc dari startDeg ke endDeg
  function arc(startDeg, endDeg) {
    const p1  = polar(startDeg);
    const p2  = polar(endDeg);
    const lg  = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
    return `M ${p1.x.toFixed(3)} ${p1.y.toFixed(3)} A ${R} ${R} 0 ${lg} 1 ${p2.x.toFixed(3)} ${p2.y.toFixed(3)}`;
  }

  // Clamp & hitung fill
  const val     = value ?? null;
  const clamped = val !== null ? Math.max(min, Math.min(max, val)) : min;
  const pct     = (clamped - min) / (max - min);
  const fillDeg = pct * ARC_TOTAL;
  const fillEnd = ARC_START + fillDeg;

  const isDanger =
    (dangerMin != null && val !== null && val < dangerMin) ||
    (dangerMax != null && val !== null && val > dangerMax);

  const arcColor = isDanger ? '#ef4444' : color;
  const gradId   = `gg-${label?.replace(/\s/g, '')}`;
  const glowId   = `gl-${label?.replace(/\s/g, '')}`;

  // Posisi needle tip
  const tip = polar(fillEnd);

  // Min/Max label positions (sedikit di luar arc)
  const labelR = R + SW + 12;
  function labelPos(deg) {
    const rad = ((deg - 90) * Math.PI) / 180;
    return {
      x: CX + labelR * Math.cos(rad),
      y: CY + labelR * Math.sin(rad),
    };
  }
  const minPos = labelPos(ARC_START);
  const maxPos = labelPos(ARC_END);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2px',
      width: '100%',
    }}>
      <svg
        width={size}
        height={size * 0.86}
        viewBox={`0 0 ${size} ${size * 0.86}`}
        overflow="visible"
      >
        <defs>
          {/* Gradient along the arc direction */}
          <linearGradient id={gradId} gradientUnits="userSpaceOnUse"
            x1={polar(ARC_START).x} y1={polar(ARC_START).y}
            x2={polar(ARC_END).x}   y2={polar(ARC_END).y}
          >
            <stop offset="0%"   stopColor={arcColor} stopOpacity={0.45} />
            <stop offset="100%" stopColor={arcColor} stopOpacity={1}    />
          </linearGradient>

          {/* Glow filter */}
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={isDanger ? 4 : 2.5} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Background track ── */}
        <path
          d={arc(ARC_START, ARC_END)}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={SW}
          strokeLinecap="round"
        />

        {/* ── Filled arc ── */}
        {val !== null && fillDeg > 0.5 && (
          <path
            d={arc(ARC_START, fillEnd)}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={SW}
            strokeLinecap="round"
            filter={`url(#${glowId})`}
            style={{ transition: 'all 0.45s cubic-bezier(.16,1,.3,1)' }}
          />
        )}

        {/* ── Needle dot at tip ── */}
        {val !== null && (
          <circle
            cx={tip.x} cy={tip.y}
            r={SW * 0.72}
            fill={arcColor}
            filter={`url(#${glowId})`}
            style={{ transition: 'cx 0.45s cubic-bezier(.16,1,.3,1), cy 0.45s cubic-bezier(.16,1,.3,1)' }}
          />
        )}

        {/* ── Center hub ── */}
        <circle
          cx={CX} cy={CY}
          r={SW * 0.55}
          fill={isDanger ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)'}
          stroke={isDanger ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}
          strokeWidth={1}
        />

        {/* ── Min label ── */}
        <text
          x={minPos.x} y={minPos.y}
          textAnchor="end" dominantBaseline="middle"
          fontSize={size * 0.072}
          fill="rgba(148,163,184,0.3)"
          fontFamily="JetBrains Mono, monospace"
        >{min}</text>

        {/* ── Max label ── */}
        <text
          x={maxPos.x} y={maxPos.y}
          textAnchor="start" dominantBaseline="middle"
          fontSize={size * 0.072}
          fill="rgba(148,163,184,0.3)"
          fontFamily="JetBrains Mono, monospace"
        >{max}</text>

        {/* ── Value ── */}
        <text
          x={CX} y={CY - size * 0.03}
          textAnchor="middle" dominantBaseline="middle"
          fontSize={size * 0.21}
          fontWeight="800"
          fill={isDanger ? '#f87171' : arcColor}
          fontFamily="JetBrains Mono, monospace"
          style={{
            filter: `drop-shadow(0 0 8px ${arcColor}60)`,
            transition: 'fill 0.3s ease',
          }}
        >
          {val ?? '–'}
        </text>

        {/* ── Unit ── */}
        <text
          x={CX} y={CY + size * 0.17}
          textAnchor="middle"
          fontSize={size * 0.075}
          fill="rgba(148,163,184,0.35)"
          fontFamily="Inter, sans-serif"
        >{unit}</text>
      </svg>

      {/* ── Label below ── */}
      <div style={{
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: isDanger ? '#f87171' : 'rgba(148,163,184,0.4)',
        marginTop: '-4px',
      }}>
        {label}
        {isDanger && (
          <span style={{ marginLeft: '5px', animation: 'blink-text 1s infinite' }}>⚠</span>
        )}
      </div>
    </div>
  );
}
