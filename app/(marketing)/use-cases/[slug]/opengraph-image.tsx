import { ImageResponse } from 'next/og';
import { getUseCase } from '@/lib/use-cases';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const uc = getUseCase(slug);

  const headline = uc?.metadata.title ?? 'Build Better Habits with Ascend';
  const description = uc?.metadata.description ?? 'Replace addictions with hobbies using science-backed habit tracking.';

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
            marginBottom: '32px',
          }}
        >
          ASCEND · ASIX.LIVE
        </div>

        <div
          style={{
            fontSize: '54px',
            fontWeight: '800',
            color: '#ffffff',
            lineHeight: 1.1,
            marginBottom: '24px',
            maxWidth: '900px',
          }}
        >
          {headline}
        </div>

        <div
          style={{
            fontSize: '24px',
            fontWeight: '400',
            color: '#94a3b8',
            lineHeight: 1.5,
            maxWidth: '780px',
          }}
        >
          {description}
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
          asix.live
        </div>
      </div>
    ),
    { ...size }
  );
}
