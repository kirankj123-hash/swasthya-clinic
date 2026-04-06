import { ImageResponse } from 'next/og';
import { BdaSealMark } from '@/components/BdaSealMark';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          padding: '8px',
        }}
      >
        <BdaSealMark idPrefix="apple-icon" size={160} showText={false} />
      </div>
    ),
    size
  );
}
