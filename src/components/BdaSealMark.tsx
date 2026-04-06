type BdaSealMarkProps = {
  size?: number;
  className?: string;
  title?: string;
  idPrefix?: string;
  showText?: boolean;
};

export function BdaSealMark({
  size = 200,
  className,
  title = 'Bangalore Development Authority seal',
  idPrefix = 'bda-seal',
  showText = true,
}: BdaSealMarkProps) {
  const upperArcId = `${idPrefix}-upper-arc`;
  const lowerArcId = `${idPrefix}-lower-arc`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
    >
      <defs>
        <path id={upperArcId} d="M 46 114 A 62 62 0 0 1 154 114" />
        <path id={lowerArcId} d="M 154 114 A 62 62 0 0 1 46 114" />
      </defs>

      <rect width="200" height="200" rx="100" fill="#ffffff" />
      <circle cx="100" cy="100" r="95" fill="none" stroke="#2f6db2" strokeWidth="4" />
      <circle cx="100" cy="100" r="88" fill="none" stroke="#2f6db2" strokeWidth="3" />
      <circle cx="100" cy="100" r="61" fill="none" stroke="#2f6db2" strokeWidth="4" />
      <circle cx="100" cy="100" r="52" fill="none" stroke="#2f6db2" strokeWidth="3" />

      {showText ? (
        <>
          <text
            fill="#2f6db2"
            fontSize="11.5"
            fontWeight="700"
            letterSpacing="1.4"
            fontFamily="Arial, Helvetica, sans-serif"
          >
            <textPath href={`#${upperArcId}`} startOffset="50%" textAnchor="middle">
              BANGALORE DEVELOPMENT
            </textPath>
          </text>
          <text
            fill="#2f6db2"
            fontSize="11.5"
            fontWeight="700"
            letterSpacing="1.8"
            fontFamily="Arial, Helvetica, sans-serif"
          >
            <textPath href={`#${lowerArcId}`} startOffset="50%" textAnchor="middle">
              AUTHORITY
            </textPath>
          </text>
        </>
      ) : null}

      <path
        d="M33 94l2.9 6.8 7.2.7-5.4 4.7 1.6 7-6.3-3.7-6.3 3.7 1.6-7-5.4-4.7 7.2-.7z"
        fill="#2f6db2"
      />
      <path
        d="M167 94l2.9 6.8 7.2.7-5.4 4.7 1.6 7-6.3-3.7-6.3 3.7 1.6-7-5.4-4.7 7.2-.7z"
        fill="#2f6db2"
      />
      <path
        d="M100 165l4.1 9.8 10.6 1-8 6.9 2.4 10.4-9.1-5.4-9.1 5.4 2.4-10.4-8-6.9 10.6-1z"
        fill="#2f6db2"
      />

      <path
        d="M83 55c11-6 25-7 37-2l18 17 8 21-4 26-18 21-29 8-29-6-14-22 3-31 14-21z"
        fill="none"
        stroke="#2f6db2"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      <path d="M59 88h81" stroke="#2f6db2" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M56 100h88" stroke="#2f6db2" strokeWidth="3" strokeLinecap="round" />
      <path d="M60 113h80" stroke="#2f6db2" strokeWidth="3" strokeLinecap="round" />
      <path d="M72 128h58" stroke="#2f6db2" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M66 74l69 53" stroke="#2f6db2" strokeWidth="3" strokeLinecap="round" />
      <path d="M69 127l63-48" stroke="#2f6db2" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M96 75c4-9 13-12 18-6 4 5 3 13 5 21 3 12 12 22 10 31-1 5-4 9-9 10-6 2-12-1-17-5-5-5-8-12-7-19 1-7 4-13 3-21-1-5-4-9-3-11z"
        fill="#214f8f"
      />
      <ellipse cx="95" cy="88" rx="5.5" ry="3" fill="#ffffff" opacity="0.9" />
      <circle cx="99" cy="94" r="2.4" fill="#ffffff" />
      <path
        d="M127 132l8 8-8 7-8-8z"
        fill="none"
        stroke="#2f6db2"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
