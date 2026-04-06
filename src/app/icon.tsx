import { ImageResponse } from 'next/og';
import { BdaSealMark } from '@/components/BdaSealMark';

export const size = {
  width: 512,
  height: 512,
};

export const contentType = 'image/png';

export default function Icon() {
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
        }}
      >
        <BdaSealMark idPrefix="app-icon" size={440} showText={false} />
      </div>
    ),
    size
  );
}
