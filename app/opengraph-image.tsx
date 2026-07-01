import { ImageResponse } from 'next/og';
import { COUNTS } from '@/lib/site';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Free Exercise DB with Videos';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#0a0a0b',
          color: '#f4f4f5',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#c6ef3a', fontSize: 30, fontWeight: 700 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: '#c6ef3a' }} />
          Free Exercise DB with Videos
        </div>
        <div style={{ fontSize: 78, fontWeight: 800, marginTop: 28, lineHeight: 1.05, letterSpacing: -2 }}>
          The free exercise API
        </div>
        <div style={{ display: 'flex', gap: 20, fontSize: 78, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
          <span>with</span>
          <span style={{ color: '#c6ef3a' }}>real demo videos</span>
        </div>
        <div style={{ fontSize: 34, color: '#a1a1aa', marginTop: 32 }}>
          {`${COUNTS.exercises} exercises · ${COUNTS.videos} male & female demo videos · MIT`}
        </div>
      </div>
    ),
    size,
  );
}
