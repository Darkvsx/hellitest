import type { Service } from '../hooks/useServices';

const MOCK_SERVICES_KEY = 'helldivers_mock_services';

const defaultServices: Omit<Service, 'id' | 'createdAt'>[] = [
  {
    title: "Level Boost (1-50)",
    description: "Complete level progression from 1 to 50 with professional helldivers. Fast, safe, and efficient leveling service.",
    price: 29.99,
    originalPrice: 39.99,
    duration: "24-48 hours",
    difficulty: "Beginner",
    features: [
      "Full level 1-50 progression",
      "All experience gained on your account",
      "Safe boosting methods",
      "24/7 progress tracking",
      "Professional helldivers team"
    ],
    active: true,
    popular: true,
    orders: 127
  },
  {
    title: "Ship Module Unlock",
    description: "Unlock all available ship modules and upgrades. Get access to powerful ship enhancements quickly.",
    price: 19.99,
    duration: "12-24 hours",
    difficulty: "Intermediate",
    features: [
      "All ship modules unlocked",
      "Strategic facility upgrades",
      "Resource farming included",
      "Quick completion guarantee",
      "Expert strategem selection"
    ],
    active: true,
    popular: false,
    orders: 89
  },
  {
    title: "Weapon Mastery Pack",
    description: "Master all weapons in Helldivers 2. Unlock weapon upgrades, attachments, and specializations.",
    price: 34.99,
    duration: "2-3 days",
    difficulty: "Advanced",
    features: [
      "All weapons mastered",
      "Unlock all attachments",
      "Weapon specialization training",
      "Combat efficiency optimization",
      "Personal weapon recommendations"
    ],
    active: true,
    popular: true,
    orders: 203
  },
  {
    title: "Stratagem Collection",
    description: "Unlock the complete stratagem library. Get access to all offensive, defensive, and support stratagems.",
    price: 24.99,
    duration: "1-2 days",
    difficulty: "Intermediate",
    features: [
      "Complete stratagem collection",
      "Tactical combinations guide",
      "Mission-specific loadouts",
      "Advanced deployment training",
      "Pro team coordination tips"
    ],
    active: true,
    popular: false,
    orders: 156
  },
  {
    title: "Super Credits Farm",
    description: "Earn Super Credits efficiently through optimized mission runs and resource management.",
    price: 15.99,
    duration: "6-12 hours",
    difficulty: "Beginner",
    features: [
      "500+ Super Credits guaranteed",
      "Optimal farming routes",
      "Resource maximization",
      "Time-efficient methods",
      "Bonus credit opportunities"
    ],
    active: true,
    popular: true,
    orders: 341
  },
  {
    title: "Hellpod Customization",
    description: "Unlock all hellpod designs, colors, and customization options. Stand out on the battlefield.",
    price: 12.99,
    duration: "4-8 hours",
    difficulty: "Beginner",
    features: [
      "All hellpod designs unlocked",
      "Complete color palette",
      "Special effect unlocks",
      "Exclusive patterns access",
      "Premium customization guide"
    ],
    active: true,
    popular: false,
    orders: 78
  }
];

export class MockServices {
  private static getServices(): Service[] {
    const services = localStorage.getItem(MOCK_SERVICES_KEY);
    if (services) {
      return JSON.parse(services);
    }
    
    // Initialize with default services
    const initialServices: Service[] = defaultServices.map((service, index) => ({
      ...service,
      id: `mock_service_${index + 1}`,
      createdAt: new Date(Date.now() - (index * 86400000)).toISOString() // Spread across days
    }));
    
    this.saveServices(initialServices);
    return initialServices;
  }

  private static saveServices(services: Service[]): void {
    localStorage.setItem(MOCK_SERVICES_KEY, JSON.stringify(services));
  }

  static async getAllServices(): Promise<{ data: Service[] | null, error: any }> {
    try {
      const services = this.getServices();
      return { data: services, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async addService(serviceData: Omit<Service, 'id' | 'createdAt' | 'orders'>): Promise<{ data: Service | null, error: any }> {
    try {
      const services = this.getServices();
      const newService: Service = {
        ...serviceData,
        id: `mock_service_${Date.now()}`,
        createdAt: new Date().toISOString(),
        orders: 0
      };
      
      services.unshift(newService);
      this.saveServices(services);
      
      return { data: newService, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async updateService(id: string, updates: Partial<Service>): Promise<{ data: Service | null, error: any }> {
    try {
      const services = this.getServices();
      const serviceIndex = services.findIndex(s => s.id === id);
      
      if (serviceIndex === -1) {
        return { data: null, error: { message: 'Service not found' } };
      }
      
      services[serviceIndex] = { ...services[serviceIndex], ...updates };
      this.saveServices(services);
      
      return { data: services[serviceIndex], error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async deleteService(id: string): Promise<{ error: any }> {
    try {
      const services = this.getServices();
      const filteredServices = services.filter(s => s.id !== id);
      this.saveServices(filteredServices);
      
      return { error: null };
    } catch (error) {
      return { error };
    }
  }
}
