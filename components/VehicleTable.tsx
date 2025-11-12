'use client';

import { useState } from 'react';
import { Edit, Trash2, MoreHorizontal, ToggleLeft, ToggleRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Vehicle } from '@/lib/models/vehicle';
import { useAuth } from '@/lib/auth/context';
import { RoleGuard } from '@/components/RoleGuard';

interface VehicleTableProps {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  onToggleStatus?: (vehicle: Vehicle) => void;
  isLoading?: boolean;
}

export function VehicleTable({ vehicles, onEdit, onDelete, onToggleStatus, isLoading = false }: VehicleTableProps) {
  const { user } = useAuth();
  const canEdit = user?.role === 'admin';

  const getStatusBadge = (status: Vehicle['status']) => {
    return (
      <Badge 
        variant={status === 'active' ? 'default' : 'secondary'}
        className={
          status === 'active' 
            ? 'bg-green-600 text-white hover:bg-green-700' 
            : 'bg-gray-600 text-white hover:bg-gray-700'
        }
      >
        {status === 'active' ? 'Activo' : 'Inactivo'}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="rounded-md border border-gray-800 bg-gray-900">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-gray-800/50">
              <TableHead className="text-gray-300">Placa</TableHead>
              <TableHead className="text-gray-300">Modelo</TableHead>
              <TableHead className="text-gray-300">Capacidad</TableHead>
              <TableHead className="text-gray-300">Estado</TableHead>
              <TableHead className="text-gray-300 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index} className="border-gray-800">
                <TableCell>
                  <div className="h-4 bg-gray-700 rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-700 rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-700 rounded animate-pulse w-16" />
                </TableCell>
                <TableCell>
                  <div className="h-6 bg-gray-700 rounded animate-pulse w-20" />
                </TableCell>
                <TableCell>
                  <div className="h-8 bg-gray-700 rounded animate-pulse w-20 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-gray-800 bg-gray-900">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-gray-800/50">
              <TableHead className="text-gray-300 min-w-[100px]">Placa</TableHead>
              <TableHead className="text-gray-300 min-w-[180px]">Modelo</TableHead>
              <TableHead className="text-gray-300 min-w-[100px]">Capacidad</TableHead>
              <TableHead className="text-gray-300 min-w-[100px]">Estado</TableHead>
              <TableHead className="text-gray-300 text-right min-w-[120px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id} className="border-gray-800 hover:bg-gray-800/30">
                <TableCell className="font-medium text-gray-100">
                  {vehicle.plate}
                </TableCell>
                <TableCell className="text-gray-300">
                  <div className="truncate max-w-[200px]" title={vehicle.model}>
                    {vehicle.model}
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">
                  {vehicle.capacity} pasajeros
                </TableCell>
                <TableCell>
                  {getStatusBadge(vehicle.status)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {/* Desktop actions */}
                    <div className="hidden sm:flex space-x-2">
                      {onToggleStatus && (
                        <RoleGuard 
                          allowedRoles={['admin']}
                          fallback={
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled
                                    className="bg-gray-800 border-gray-700 text-gray-400"
                                  >
                                    {vehicle.status === 'active' ? (
                                      <ToggleRight className="h-4 w-4" />
                                    ) : (
                                      <ToggleLeft className="h-4 w-4" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Permiso requerido</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          }
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onToggleStatus(vehicle)}
                            className="bg-gray-800 border-gray-700 text-yellow-400 hover:bg-gray-700 hover:text-yellow-300"
                          >
                            {vehicle.status === 'active' ? (
                              <ToggleRight className="h-4 w-4" />
                            ) : (
                              <ToggleLeft className="h-4 w-4" />
                            )}
                          </Button>
                        </RoleGuard>
                      )}
                      
                      <RoleGuard 
                        allowedRoles={['admin']}
                        fallback={
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled
                                  className="bg-gray-800 border-gray-700 text-gray-400"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Permiso requerido</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        }
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(vehicle)}
                          className="bg-gray-800 border-gray-700 text-blue-400 hover:bg-gray-700 hover:text-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </RoleGuard>
                      
                      <RoleGuard 
                        allowedRoles={['admin']}
                        fallback={
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled
                                  className="bg-gray-800 border-gray-700 text-gray-400"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Permiso requerido</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        }
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete(vehicle)}
                          className="bg-gray-800 border-gray-700 text-red-400 hover:bg-gray-700 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </RoleGuard>
                    </div>

                    {/* Mobile dropdown menu */}
                    <div className="sm:hidden">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menú</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          align="end" 
                          className="bg-gray-800 border-gray-700"
                        >
                          {onToggleStatus && (
                            <RoleGuard 
                              allowedRoles={['admin']}
                              fallback={
                                <DropdownMenuItem 
                                  disabled
                                  className="text-gray-500 focus:text-gray-500"
                                >
                                  {vehicle.status === 'active' ? (
                                    <ToggleRight className="mr-2 h-4 w-4" />
                                  ) : (
                                    <ToggleLeft className="mr-2 h-4 w-4" />
                                  )}
                                  {vehicle.status === 'active' ? 'Desactivar' : 'Activar'}
                                </DropdownMenuItem>
                              }
                            >
                              <DropdownMenuItem 
                                onClick={() => onToggleStatus(vehicle)}
                                className="text-yellow-400 focus:text-yellow-300 focus:bg-gray-700"
                              >
                                {vehicle.status === 'active' ? (
                                  <ToggleRight className="mr-2 h-4 w-4" />
                                ) : (
                                  <ToggleLeft className="mr-2 h-4 w-4" />
                                )}
                                {vehicle.status === 'active' ? 'Desactivar' : 'Activar'}
                              </DropdownMenuItem>
                            </RoleGuard>
                          )}
                          
                          <RoleGuard 
                            allowedRoles={['admin']}
                            fallback={
                              <DropdownMenuItem 
                                disabled
                                className="text-gray-500 focus:text-gray-500"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                            }
                          >
                            <DropdownMenuItem 
                              onClick={() => onEdit(vehicle)}
                              className="text-blue-400 focus:text-blue-300 focus:bg-gray-700"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                          </RoleGuard>
                          
                          <RoleGuard 
                            allowedRoles={['admin']}
                            fallback={
                              <DropdownMenuItem 
                                disabled
                                className="text-gray-500 focus:text-gray-500"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            }
                          >
                            <DropdownMenuItem 
                              onClick={() => onDelete(vehicle)}
                              className="text-red-400 focus:text-red-300 focus:bg-gray-700"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </RoleGuard>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}