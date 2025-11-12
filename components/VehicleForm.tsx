'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Vehicle, VehicleCreate, VehicleUpdate } from '@/lib/models/vehicle';

const vehicleSchema = z.object({
  plate: z.string().min(1, 'La placa es requerida').max(10, 'La placa no puede tener más de 10 caracteres'),
  model: z.string().min(1, 'El modelo es requerido').max(50, 'El modelo no puede tener más de 50 caracteres'),
  capacity: z.number().min(1, 'La capacidad debe ser mayor a 0').max(999, 'La capacidad no puede ser mayor a 999'),
  status: z.enum(['active', 'inactive']),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSubmit: (data: VehicleCreate | VehicleUpdate) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function VehicleForm({ vehicle, onSubmit, onCancel, isSubmitting = false }: VehicleFormProps) {
  const isEditing = !!vehicle;
  
  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      plate: vehicle?.plate || '',
      model: vehicle?.model || '',
      capacity: vehicle?.capacity || 0,
      status: vehicle?.status || 'active',
    },
  });

  const handleSubmit = (data: VehicleFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="plate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-200">Placa</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ej. ABC123"
                    className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-200">Modelo</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ej. Toyota Coaster"
                    className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-200">Capacidad (pasajeros)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="1"
                    max="999"
                    placeholder="Ej. 32"
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-200">Estado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-100 focus:border-blue-500">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="active" className="text-gray-100 focus:bg-gray-700">Activo</SelectItem>
                    <SelectItem value="inactive" className="text-gray-100 focus:bg-gray-700">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Dar de Alta'}
          </Button>
        </div>
      </form>
    </Form>
  );
}