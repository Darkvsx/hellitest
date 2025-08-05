import { createContext, useContext, useState, ReactNode } from 'react';

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
  addService: (service: Omit<Service, 'id' | 'createdAt' | 'orders'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  toggleServiceStatus: (id: string) => void;
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export function ServicesProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>([]);

  const addService = (serviceData: Omit<Service, 'id' | 'createdAt' | 'orders'>) => {
    const newService: Service = {
      ...serviceData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      orders: 0
    };
    setServices(prev => [...prev, newService]);
  };

  const updateService = (id: string, serviceData: Partial<Service>) => {
    setServices(prev => 
      prev.map(service => 
        service.id === id ? { ...service, ...serviceData } : service
      )
    );
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };

  const toggleServiceStatus = (id: string) => {
    setServices(prev =>
      prev.map(service =>
        service.id === id ? { ...service, active: !service.active } : service
      )
    );
  };

  return (
    <ServicesContext.Provider value={{
      services,
      addService,
      updateService,
      deleteService,
      toggleServiceStatus
    }}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
}
