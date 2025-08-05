import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from '../lib/supabase';
import { seedServices } from '../lib/seedData';
import type { Database } from '../lib/supabase';

type ServiceRow = Database['public']['Tables']['services']['Row'];
type ServiceInsert = Database['public']['Tables']['services']['Insert'];
type ServiceUpdate = Database['public']['Tables']['services']['Update'];

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  duration: string;
  difficulty: string;
  features: string[];
  active: boolean;
  popular?: boolean;
  createdAt: string;
  orders: number;
}

interface ServicesContextType {
  services: Service[];
  loading: boolean;
  error: string | null;
  addService: (service: Omit<Service, "id" | "createdAt" | "orders">) => Promise<void>;
  updateService: (id: string, service: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  toggleServiceStatus: (id: string) => Promise<void>;
  refreshServices: () => Promise<void>;
}

const ServicesContext = createContext<ServicesContextType | undefined>(
  undefined,
);

export function ServicesProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapServiceFromDB = (service: ServiceRow): Service => ({
    id: service.id,
    title: service.title,
    description: service.description,
    price: Number(service.price),
    originalPrice: service.original_price ? Number(service.original_price) : undefined,
    duration: service.duration,
    difficulty: service.difficulty,
    features: service.features,
    active: service.active,
    popular: service.popular,
    createdAt: service.created_at,
    orders: service.orders_count
  });

  const refreshServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Supabase fetch error:', fetchError);
        throw fetchError;
      }

      const mappedServices = data?.map(mapServiceFromDB) || [];
      setServices(mappedServices);
      console.log('Services loaded successfully:', mappedServices.length);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshServices();
  }, []);

  const addService = async (
    serviceData: Omit<Service, "id" | "createdAt" | "orders">,
  ) => {
    try {
      const insertData: ServiceInsert = {
        title: serviceData.title,
        description: serviceData.description,
        price: serviceData.price,
        original_price: serviceData.originalPrice || null,
        duration: serviceData.duration,
        difficulty: serviceData.difficulty,
        features: serviceData.features,
        active: serviceData.active,
        popular: serviceData.popular || false,
        orders_count: 0
      };

      const { data, error } = await supabase
        .from('services')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newService = mapServiceFromDB(data);
        setServices((prev) => [newService, ...prev]);
      }
    } catch (err) {
      console.error('Error adding service:', err);
      setError('Failed to add service');
    }
  };

  const updateService = async (id: string, serviceData: Partial<Service>) => {
    try {
      const updateData: ServiceUpdate = {};
      
      if (serviceData.title !== undefined) updateData.title = serviceData.title;
      if (serviceData.description !== undefined) updateData.description = serviceData.description;
      if (serviceData.price !== undefined) updateData.price = serviceData.price;
      if (serviceData.originalPrice !== undefined) updateData.original_price = serviceData.originalPrice;
      if (serviceData.duration !== undefined) updateData.duration = serviceData.duration;
      if (serviceData.difficulty !== undefined) updateData.difficulty = serviceData.difficulty;
      if (serviceData.features !== undefined) updateData.features = serviceData.features;
      if (serviceData.active !== undefined) updateData.active = serviceData.active;
      if (serviceData.popular !== undefined) updateData.popular = serviceData.popular;

      const { data, error } = await supabase
        .from('services')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const updatedService = mapServiceFromDB(data);
        setServices((prev) =>
          prev.map((service) =>
            service.id === id ? updatedService : service,
          ),
        );
      }
    } catch (err) {
      console.error('Error updating service:', err);
      setError('Failed to update service');
    }
  };

  const deleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setServices((prev) => prev.filter((service) => service.id !== id));
    } catch (err) {
      console.error('Error deleting service:', err);
      setError('Failed to delete service');
    }
  };

  const toggleServiceStatus = async (id: string) => {
    try {
      const service = services.find(s => s.id === id);
      if (!service) return;

      const { data, error } = await supabase
        .from('services')
        .update({ active: !service.active })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const updatedService = mapServiceFromDB(data);
        setServices((prev) =>
          prev.map((s) =>
            s.id === id ? updatedService : s,
          ),
        );
      }
    } catch (err) {
      console.error('Error toggling service status:', err);
      setError('Failed to update service status');
    }
  };

  return (
    <ServicesContext.Provider
      value={{
        services,
        loading,
        error,
        addService,
        updateService,
        deleteService,
        toggleServiceStatus,
        refreshServices,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error("useServices must be used within a ServicesProvider");
  }
  return context;
}
