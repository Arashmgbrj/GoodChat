import './globals.css';
import Preloader from './preloader/Preloader';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GoodChat / چت زیبا',
  description: 'پلتفرم چت با هوش مصنوعی',
  other: {
    enamad: '2953446', // ✅ این متاتگ مخصوص eNamad است
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <Preloader>{children}</Preloader>
        
      </body>
    </html>
  );
}
