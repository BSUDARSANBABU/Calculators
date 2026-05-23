/**
 * @typedef {'dashboard' | 'shipments' | 'fleet' | 'inventory' | 'analytics' | 'settings'} Tab
 *
 * @typedef {'In Transit' | 'Delivered' | 'Delayed' | 'Pending'} ShipmentStatus
 *
 * @typedef {Object} ShipmentLog
 * @property {string} timestamp
 * @property {string} title
 * @property {string} location
 * @property {string} description
 *
 * @typedef {Object} Shipment
 * @property {string} id
 * @property {string} trackingNumber
 * @property {string} origin
 * @property {string} destination
 * @property {ShipmentStatus} status
 * @property {string} carrier
 * @property {'Low' | 'Medium' | 'High'} priority
 * @property {number} transitTimeHrs
 * @property {string} dateCreated
 * @property {number} progressPercent
 * @property {string} [notes]
 * @property {ShipmentLog[]} logs
 *
 * @typedef {'Truck' | 'Cargo Ship' | 'Freight Train' | 'Delivery Van' | 'Air Cargo'} FleetVehicleType
 * @typedef {'Operational' | 'Idle' | 'In Maintenance' | 'Delayed'} FleetStatus
 *
 * @typedef {Object} FleetVehicle
 * @property {string} id
 * @property {string} vehicleCode
 * @property {FleetVehicleType} type
 * @property {FleetStatus} status
 * @property {number} speedKmh
 * @property {number} fuelLevelPercent
 * @property {string} driverName
 * @property {Object} currentRoute
 * @property {string} currentRoute.from
 * @property {string} currentRoute.to
 * @property {number} currentRoute.percentComplete
 * @property {number} capacityLoadPercent
 *
 * @typedef {'Heavy Machinery' | 'Electronics' | 'Automotive Parts' | 'Raw Materials' | 'Consumer Goods' | 'Perishables'} InventoryCategory
 * @typedef {'In Stock' | 'Low Stock' | 'Out of Stock'} InventoryStatus
 *
 * @typedef {Object} InventoryItem
 * @property {string} id
 * @property {string} sku
 * @property {string} name
 * @property {InventoryCategory} category
 * @property {number} quantity
 * @property {string} warehouseHub
 * @property {number} threshold
 * @property {InventoryStatus} status
 *
 * @typedef {Object} WarehouseCapacity
 * @property {string} id
 * @property {string} name
 * @property {string} location
 * @property {number} capacityUsedPercent
 * @property {number} totalVolumeCubicMeters
 * @property {number} activeStaff
 */

export {};
