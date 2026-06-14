import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Asix — Ascend, GeoIntel, WikiHole';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #0f0f0f 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Brand */}
        <div
          style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#a0a0b0',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}
        >
          ASIX
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '52px',
            fontWeight: '800',
            color: '#ffffff',
            lineHeight: 1.1,
            marginBottom: '48px',
            maxWidth: '800px',
          }}
        >
          Tools that help you think clearly and act decisively.
        </div>

        {/* Products */}
        <div style={{ display: 'flex', gap: '32px' }}>
          {[
            { icon: '⚡', name: 'Ascend', desc: 'Habit Tracker' },
            { icon: '🌍', name: 'GeoIntel', desc: 'Geopolitical Intelligence' },
            { icon: '🕳️', name: 'WikiHole', desc: 'Wikipedia Explorer' },
          ].map((p) => (
            <div
              key={p.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                background: 'rgba(255,255,255,0.07)',
                borderRadius: '16px',
                padding: '20px 28px',
                border: '1px solid rgba(255,255,255,0.1)',
                minWidth: '220px',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{p.icon}</div>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                {p.name}
              </div>
              <div style={{ fontSize: '15px', color: '#a0a0b0' }}>{p.desc}</div>
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            right: '80px',
            fontSize: '18px',
            color: '#606070',
            letterSpacing: '0.05em',
          }}
        >
          asix.live
        </div>
      </div>
    ),
    { ...size }
  );
}
