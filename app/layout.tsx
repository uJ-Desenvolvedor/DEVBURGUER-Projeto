import type { Metadata } from 'next';
import { Barlow_Condensed, Inter } from 'next/font/google';
import './globals.css';

const display = Barlow_Condensed({ variable: '--font-display', subsets: ['latin'], weight: ['600','700','800','900'] });
const body = Inter({ variable: '--font-body', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'DEVBURGUER | O melhor hambúrguer está aqui',
  description: 'Hambúrgueres artesanais, cardápio online, pedidos e entrega rápida.',
  openGraph: {
    title: 'DEVBURGUER | O melhor hambúrguer está aqui',
    description: 'Hambúrgueres artesanais, cardápio online, pedidos e entrega rápida.',
    images: [{ url: '/og.png', width: 2560, height: 1440, alt: 'DEVBURGUER' }],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DEVBURGUER | O melhor hambúrguer está aqui',
    description: 'Hambúrgueres artesanais, cardápio online, pedidos e entrega rápida.',
    images: ['/og.png'],
  },
  icons: { icon: '/logo-symbol.png' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body className={`${display.variable} ${body.variable}`}>{children}</body></html>;
}
