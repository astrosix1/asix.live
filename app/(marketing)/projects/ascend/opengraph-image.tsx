import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Ascend - Replace Addictions with Hobbies';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1c0a00 60%, #0f172a 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#f59e0b',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}
        >
          ASIX.LIVE
        </div>

        <div
          style={{
            fontSize: '64px',
            marginBottom: '16px',
          }}
        >
          ⚡
        </div>

        <div
          style={{
            fontSize: '56px',
            fontWeight: '800',
            color: '#ffffff',
            lineHeight: 1.1,
            marginBottom: '20px',
          }}
        >
          Ascend
        </div>

        <div
          style={{
            fontSize: '26px',
            fontWeight: '400',
            color: '#94a3b8',
            lineHeight: 1.4,
            maxWidth: '700px',
          }}
        >
          Replace addictions with hobbies. Build sustainable habits with an intuitive mobile app.
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            right: '80px',
            fontSize: '18px',
            color: '#f59e0b',
            letterSpacing: '0.05em',
            opacity: 0.7,
          }}
        >
          asix.live/projects/ascend
        </div>
      </div>
    ),
    { ...size }
  );
}
