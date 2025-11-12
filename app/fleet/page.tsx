'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { NavBar } from '@/components/NavBar';
import { SideBar } from '@/components/SideBar';
import { VehicleTable } from '@/components/VehicleTable';
import { VehicleForm } from '@/components/VehicleForm';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EmptyState } from '@/components/EmptyState';
import { RoleGuard } from '@/components/RoleGuard';
import { useAuth } from '@/lib/auth/context';
import { Vehicle, VehicleCreate, VehicleUpdate } from '@/lib/models/vehicle';
import * as vehicleApi from '@/lib/api/vehicles';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function FleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user } = useAuth();
  const canManage = user?.role === 'admin';

  const loadVehicles = async () => {
    try {
      setError(null);
      const data = await vehicleApi.listVehicles();
      setVehicles(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar vehículos';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleCreateVehicle = () => {
    setSelectedVehicle(undefined);
    setIsFormOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data: VehicleCreate | VehicleUpdate) => {
    try {
      setIsSubmitting(true);
      
      if (selectedVehicle) {
        // Edit existing vehicle
        const updated = await vehicleApi.updateVehicle(selectedVehicle.id, data as VehicleUpdate);
        setVehicles(prev => prev.map(v => v.id === selectedVehicle.id ? updated : v));
        toast.success('Vehículo actualizado correctamente');
      } else {
        // Create new vehicle
        const created = await vehicleApi.createVehicle(data as VehicleCreate);
        setVehicles(prev => [...prev, created]);
        toast.success('Vehículo dado de alta correctamente');
      }
      
      setIsFormOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar vehículo';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedVehicle) return;
    
    try {
      setIsSubmitting(true);
      await vehicleApi.deleteVehicle(selectedVehicle.id);
      setVehicles(prev => prev.filter(v => v.id !== selectedVehicle.id));
      toast.success('Vehículo dado de baja correctamente');
      setIsDeleteDialogOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar vehículo';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (vehicle: Vehicle) => {
    try {
      const updated = await vehicleApi.toggleVehicleStatus(vehicle.id);
      setVehicles(prev => prev.map(v => v.id === vehicle.id ? updated : v));
      toast.success(`Vehículo ${updated.status === 'active' ? 'activado' : 'desactivado'} correctamente`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cambiar estado del vehículo';
      toast.error(message);
    }
  };

  const handleRetry = () => {
    setIsLoading(true);
    loadVehicles();
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col md:ml-0">
        <NavBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-100">Gestión de Flota</h1>
                <p className="text-gray-400 mt-2">
                  Administra y monitorea tu flota de vehículos
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0">
                <RoleGuard
                  allowedRoles={['admin']}
                  fallback={
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            disabled
                            className="w-full sm:w-auto bg-gray-700 text-gray-400 cursor-not-allowed"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Dar de alta vehículo
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
                    onClick={handleCreateVehicle}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Dar de alta vehículo
                  </Button>
                </RoleGuard>
              </div>
            </div>

            {/* Error state */}
            {error && (
              <Alert className="mb-6 bg-red-900/20 border-red-900/50">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-400">
                  {error}
                  <Button
                    variant="link"
                    className="text-red-400 underline p-0 ml-2 h-auto"
                    onClick={handleRetry}
                  >
                    Reintentar
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Content */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-100">
                  Vehículos ({vehicles.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isLoading && !error && vehicles.length === 0 ? (
                  <EmptyState
                    action={canManage ? {
                      label: 'Dar de alta vehículo',
                      onClick: handleCreateVehicle,
                    } : undefined}
                  />
                ) : (
                  <VehicleTable
                    vehicles={vehicles}
                    onEdit={handleEditVehicle}
                    onDelete={handleDeleteVehicle}
                    onToggleStatus={handleToggleStatus}
                    isLoading={isLoading}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Vehicle Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-100">
              {selectedVehicle ? 'Editar Vehículo' : 'Dar de Alta Vehículo'}
            </DialogTitle>
          </DialogHeader>
          <VehicleForm
            vehicle={selectedVehicle}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="¿Dar de baja vehículo?"
        description={`¿Está seguro de que desea dar de baja el vehículo ${selectedVehicle?.plate}? Esta acción no se puede deshacer.`}
        confirmLabel="Dar de baja"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        variant="destructive"
      />
    </div>
  );
}
