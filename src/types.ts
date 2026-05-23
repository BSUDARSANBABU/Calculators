export type Tab = 'dashboard' | 'shipments' | 'fleet' | 'inventory' | 'analytics' | 'settings';

export interface Shipment {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: 'In Transit' | 'Delivered' | 'Delayed' | 'Pending';
  carrier: string;
  priority: 'Low' | 'Medium' | 'High';
  transitTimeHrs: number;
  dateCreated: string;
  progressPercent: number; // 0 to 100
  notes?: string;
  logs: ShipmentLog[];
}

export interface ShipmentLog {
  timestamp: string;
  title: string;
  location: string;
  description: string;
}

export interface FleetVehicle {
  id: string;
  vehicleCode: string;
  type: 'Truck' | 'Cargo Ship' | 'Freight Train' | 'Delivery Van' | 'Air Cargo';
  status: 'Operational' | 'Idle' | 'In Maintenance' | 'Delayed';
  speedKmh: number;
  fuelLevelPercent: number;
  driverName: string;
  currentRoute: {
    from: string;
    to: string;
    percentComplete: number;
  };
  capacityLoadPercent: number;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'Heavy Machinery' | 'Electronics' | 'Automotive Parts' | 'Raw Materials' | 'Consumer Goods' | 'Perishables';
  quantity: number;
  warehouseHub: string;
  threshold: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface WarehouseCapacity {
  id: string;
  name: string;
  location: string;
  capacityUsedPercent: number;
  totalVolumeCubicMeters: number;
  activeStaff: number;
}
