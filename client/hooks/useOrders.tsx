import { createContext, useContext, useState, ReactNode } from 'react';

export interface Order {
  id: string;
  userId: string;
  customerEmail: string;
  customerName: string;
  services: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  status: 'pending' | 'processing' | 'in-progress' | 'completed' | 'cancelled';
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
  estimatedCompletion?: string;
  assignedBooster?: string;
  progress?: number;
  notes?: string;
  messages: {
    id: string;
    from: 'customer' | 'admin' | 'booster';
    message: string;
    timestamp: string;
    isRead: boolean;
  }[];
  tracking: {
    status: string;
    timestamp: string;
    description: string;
  }[];
}

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'messages' | 'tracking'>) => string;
  updateOrderStatus: (orderId: string, status: Order['status'], progress?: number) => void;
  addOrderMessage: (orderId: string, from: 'customer' | 'admin' | 'booster', message: string) => void;
  markMessageAsRead: (orderId: string, messageId: string) => void;
  getUserOrders: (userId: string) => Order[];
  getOrder: (orderId: string) => Order | undefined;
  assignBooster: (orderId: string, boosterName: string) => void;
  addTrackingUpdate: (orderId: string, status: string, description: string) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([
    // Sample orders for demo
    {
      id: 'ORD-2024-001',
      userId: '2',
      customerEmail: 'user@example.com',
      customerName: 'John Helldiver',
      services: [
        { id: 'level-boost', name: 'Level Boost (1-50)', price: 29.99, quantity: 1 }
      ],
      status: 'in-progress',
      totalAmount: 29.99,
      paymentStatus: 'paid',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:30:00Z',
      estimatedCompletion: '2024-01-17T18:00:00Z',
      assignedBooster: 'Elite_Player_X',
      progress: 65,
      notes: 'Customer prefers evening hours for boosting',
      messages: [
        {
          id: 'msg-1',
          from: 'admin',
          message: 'Your order has been assigned to our top booster. We\'ll start within the next hour.',
          timestamp: '2024-01-15T11:00:00Z',
          isRead: true
        },
        {
          id: 'msg-2',
          from: 'booster',
          message: 'Starting your level boost now. Currently at level 35/50.',
          timestamp: '2024-01-15T14:30:00Z',
          isRead: false
        }
      ],
      tracking: [
        {
          status: 'Order Placed',
          timestamp: '2024-01-15T10:30:00Z',
          description: 'Your order has been received and payment confirmed'
        },
        {
          status: 'Booster Assigned',
          timestamp: '2024-01-15T11:00:00Z',
          description: 'Elite_Player_X has been assigned to your order'
        },
        {
          status: 'Boost Started',
          timestamp: '2024-01-15T12:00:00Z',
          description: 'Level boosting has begun'
        },
        {
          status: 'Progress Update',
          timestamp: '2024-01-15T14:30:00Z',
          description: 'Level 35 reached - 70% complete'
        }
      ]
    }
  ]);

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'messages' | 'tracking'>): string => {
    const orderId = `ORD-${Date.now()}`;
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
      tracking: [
        {
          status: 'Order Placed',
          timestamp: new Date().toISOString(),
          description: 'Your order has been received and is being processed'
        }
      ]
    };
    
    setOrders(prev => [...prev, newOrder]);
    return orderId;
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], progress?: number) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status, 
            progress: progress ?? order.progress,
            updatedAt: new Date().toISOString()
          }
        : order
    ));
  };

  const addOrderMessage = (orderId: string, from: 'customer' | 'admin' | 'booster', message: string) => {
    const messageId = `msg-${Date.now()}`;
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? {
            ...order,
            messages: [...order.messages, {
              id: messageId,
              from,
              message,
              timestamp: new Date().toISOString(),
              isRead: false
            }],
            updatedAt: new Date().toISOString()
          }
        : order
    ));
  };

  const markMessageAsRead = (orderId: string, messageId: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? {
            ...order,
            messages: order.messages.map(msg =>
              msg.id === messageId ? { ...msg, isRead: true } : msg
            )
          }
        : order
    ));
  };

  const getUserOrders = (userId: string): Order[] => {
    return orders.filter(order => order.userId === userId);
  };

  const getOrder = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  const assignBooster = (orderId: string, boosterName: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? {
            ...order,
            assignedBooster: boosterName,
            updatedAt: new Date().toISOString()
          }
        : order
    ));
  };

  const addTrackingUpdate = (orderId: string, status: string, description: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? {
            ...order,
            tracking: [...order.tracking, {
              status,
              timestamp: new Date().toISOString(),
              description
            }],
            updatedAt: new Date().toISOString()
          }
        : order
    ));
  };

  return (
    <OrdersContext.Provider value={{
      orders,
      addOrder,
      updateOrderStatus,
      addOrderMessage,
      markMessageAsRead,
      getUserOrders,
      getOrder,
      assignBooster,
      addTrackingUpdate
    }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}
