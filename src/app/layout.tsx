import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { BdaSealMark } from '@/components/BdaSealMark';

export const metadata: Metadata = {
  title: 'BDA CPIMS | Commissioner Public Interaction Management System',
  description: 'Bangalore Development Authority — Commissioner Public Interaction Management System (BDA CPIMS)',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <header className="bda-header">
          <div className="max-w-7xl px-4 bda-header-inner">
            <Link href="/" className="bda-brand">
              <div className="bda-seal" aria-hidden="true">
                <BdaSealMark idPrefix="header-seal" size={52} />
              </div>
              <div className="bda-brand-text">
                <span className="bda-brand-kannada">ಬೆಂಗಳೂರು ಅಭಿವೃದ್ಧಿ ಪ್ರಾಧಿಕಾರ</span>
                <span className="bda-brand-english">Bangalore Development Authority</span>
              </div>
              <div className="bda-prism-badge">BDA CPIMS</div>
            </Link>

            <nav className="bda-nav">
              <Link href="/citizen" className="bda-nav-link">Citizen Services</Link>
              <Link href="/staff" className="bda-nav-link">Staff Operations</Link>
              <Link href="/dashboard" className="bda-nav-link">Commissioner View</Link>
            </nav>
          </div>
        </header>

        <main className="max-w-7xl px-4 py-8">
          {children}
        </main>

        <footer className="bda-footer">
          <div className="max-w-7xl px-4">
            <div className="bda-footer-mark" aria-hidden="true">
              <BdaSealMark idPrefix="footer-seal" size={32} />
            </div>
            <span>BDA CPIMS — Commissioner Public Interaction Management System</span>
            <span className="bda-footer-sep">|</span>
            <span>ಬೆಂಗಳೂರು ಅಭಿವೃದ್ಧಿ ಪ್ರಾಧಿಕಾರ</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
