import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth/context';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FleetGuard360 - Sistema de Gestión de Flotas',
  description: 'Sistema integral para la gestión y monitoreo de flotas vehiculares',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-950 text-gray-100`}>
        <AuthProvider>
          {children}
          <Toaster 
            theme="dark" 
            className="toaster group"
            toastOptions={{
              classNames: {
                toast: "group toast group-[.toaster]:bg-gray-900 group-[.toaster]:text-gray-100 group-[.toaster]:border-gray-800 group-[.toaster]:shadow-lg",
                description: "group-[.toast]:text-gray-400",
                actionButton: "group-[.toast]:bg-blue-600 group-[.toast]:text-white",
                cancelButton: "group-[.toast]:bg-gray-600 group-[.toast]:text-gray-100",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}