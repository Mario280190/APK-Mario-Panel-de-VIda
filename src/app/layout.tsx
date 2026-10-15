import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Panel de vida · Mario', description: 'Tu día, tus contratos y tus decisiones en un mismo lugar.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body>{children}</body></html>; }
