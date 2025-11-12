'use client';

import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Truck,
  AlertTriangle,
  BarChart3,
  Settings,
  LogOut,
  X,
  Radio,
  History,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/context';

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Gestión de Flota', href: '/fleet', icon: Truck, roles: ['admin', 'operator'] },
  { name: 'Monitoreo en tiempo real', href: '/monitoring', icon: Radio, roles: ['admin', 'operator'] },
  { name: 'Historial de ubicaciones', href: '/history', icon: History, roles: ['admin', 'operator'] },
  { name: 'Alertas', href: '/alerts', icon: AlertTriangle, roles: ['admin', 'operator'] },
  { name: 'Reportes', href: '/reports', icon: BarChart3, roles: ['admin'], disabled: true },
  { name: 'Configuración', href: '/settings', icon: Settings, roles: ['admin'], disabled: true },
];

export function SideBar({ isOpen, onClose }: SideBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800 md:hidden">
            <h2 className="text-lg font-semibold text-white">Navegación</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5 text-gray-400" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-2">
              {filteredNavigation.map((item) => {
                const isActive = pathname === item.href;
                const isDisabled = item.disabled;
                
                return (
                  <Button
                    key={item.name}
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800',
                      isActive && 'bg-gray-800 text-white',
                      isDisabled && 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-gray-300'
                    )}
                    onClick={() => {
                      if (!isDisabled) {
                        router.push(item.href);
                        onClose();
                      }
                    }}
                    disabled={isDisabled}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </Button>
                );
              })}
            </nav>
          </ScrollArea>

          {/* User info and logout */}
          <div className="border-t border-gray-800 p-4">
            <div className="text-sm text-gray-400 mb-2">
              Conectado como: <span className="text-gray-300">{user?.role}</span>
            </div>
            <Separator className="my-2 bg-gray-800" />
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}