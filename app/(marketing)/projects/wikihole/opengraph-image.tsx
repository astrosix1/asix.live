import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'WikiHole - The Rabbit Hole That Sticks';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1a0a2e 60%, #0f172a 100%)',
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
            color: '#a78bfa',
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
          🕳️
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
          WikiHole
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
          The rabbit hole that sticks. Explore Wikipedia and build lasting knowledge with AI flashcards.
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            right: '80px',
            fontSize: '18px',
            color: '#a78bfa',
            letterSpacing: '0.05em',
            opacity: 0.7,
          }}
        >
          asix.live/projects/wikihole
        </div>
      </div>
    ),
    { ...size }
  );
}
