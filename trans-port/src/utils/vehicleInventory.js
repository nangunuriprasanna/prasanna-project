// Vehicle inventory and availability system

// Define vehicle fleet with routes
export const VEHICLE_FLEET = [
  // Motorcycles
  { id: 'm1', type: 'motorcycle', capacity: 2, routes: ['city-center', 'airport', 'station'], available: true },
  { id: 'm2', type: 'motorcycle', capacity: 2, routes: ['city-center', 'mall', 'hospital'], available: true },
  
  // Autos
  { id: 'a1', type: 'auto', capacity: 4, routes: ['city-center', 'airport', 'station', 'mall'], available: true },
  { id: 'a2', type: 'auto', capacity: 4, routes: ['city-center', 'hospital', 'university'], available: true },
  { id: 'a3', type: 'auto', capacity: 4, routes: ['airport', 'station', 'hotel'], available: true },
  
  // Sedans
  { id: 's1', type: 'sedan', capacity: 5, routes: ['city-center', 'airport', 'station', 'mall', 'hotel'], available: true },
  { id: 's2', type: 'sedan', capacity: 5, routes: ['city-center', 'hospital', 'university', 'mall'], available: true },
  { id: 's3', type: 'sedan', capacity: 5, routes: ['airport', 'station', 'hotel', 'resort'], available: true },
  
  // SUVs
  { id: 'u1', type: 'suv', capacity: 8, routes: ['city-center', 'airport', 'station', 'mall', 'hotel', 'resort'], available: true },
  { id: 'u2', type: 'suv', capacity: 8, routes: ['city-center', 'hospital', 'university', 'mall', 'park'], available: true },
  { id: 'u3', type: 'suv', capacity: 8, routes: ['airport', 'station', 'hotel', 'resort', 'beach'], available: true },
  
  // Vans
  { id: 'v1', type: 'van', capacity: 15, routes: ['city-center', 'airport', 'station', 'mall', 'hotel', 'university'], available: true },
  { id: 'v2', type: 'van', capacity: 15, routes: ['city-center', 'hospital', 'university', 'mall', 'park'], available: true },
  { id: 'v3', type: 'van', capacity: 15, routes: ['airport', 'station', 'hotel', 'resort'], available: true },
  
  // Buses
  { id: 'b1', type: 'bus', capacity: 50, routes: ['city-center', 'airport', 'station', 'mall', 'hotel', 'university', 'hospital'], available: true },
  { id: 'b2', type: 'bus', capacity: 50, routes: ['city-center', 'airport', 'station', 'mall', 'hotel', 'resort'], available: true },
  { id: 'b3', type: 'bus', capacity: 50, routes: ['city-center', 'hospital', 'university', 'mall', 'park', 'beach'], available: true },
  { id: 'b4', type: 'bus', capacity: 50, routes: ['airport', 'station', 'hotel', 'resort', 'beach'], available: true },
  
  // Trucks
  { id: 't1', type: 'truck', capacity: 2, routes: ['city-center', 'airport', 'station', 'warehouse'], available: true },
  { id: 't2', type: 'truck', capacity: 2, routes: ['city-center', 'mall', 'warehouse', 'factory'], available: true },
];

// Route mapping - maps location keywords to route identifiers
export const ROUTE_MAPPING = {
  'city center': 'city-center',
  'city-center': 'city-center',
  'downtown': 'city-center',
  'center': 'city-center',
  
  'airport': 'airport',
  'airport terminal': 'airport',
  
  'station': 'station',
  'railway station': 'station',
  'bus station': 'station',
  'train station': 'station',
  
  'mall': 'mall',
  'shopping mall': 'mall',
  'shopping center': 'mall',
  
  'hotel': 'hotel',
  'resort': 'resort',
  'beach': 'beach',
  'park': 'park',
  'hospital': 'hospital',
  'university': 'university',
  'college': 'university',
  'warehouse': 'warehouse',
  'factory': 'factory',
};

// Normalize location to route identifier
export const normalizeLocation = (location) => {
  if (!location) return null;
  const lowerLocation = location.toLowerCase().trim();
  
  // Check for exact matches first
  for (const [key, route] of Object.entries(ROUTE_MAPPING)) {
    if (lowerLocation.includes(key)) {
      return route;
    }
  }
  
  // Default to city-center if no match
  return 'city-center';
};

// Check vehicle availability based on route and time
export const checkVehicleAvailability = (pickupPoint, dropPoint, bookingDate, bookingTime, existingBookings = []) => {
  const pickupRoute = normalizeLocation(pickupPoint);
  const dropRoute = normalizeLocation(dropPoint);
  
  if (!pickupRoute || !dropRoute) {
    return { available: [], counts: {} };
  }
  
  // Check if both pickup and drop points are in vehicle's route
  const availableVehicles = VEHICLE_FLEET.filter(vehicle => {
    const hasPickupRoute = vehicle.routes.includes(pickupRoute);
    const hasDropRoute = vehicle.routes.includes(dropRoute);
    
    if (!hasPickupRoute || !hasDropRoute) {
      return false;
    }
    
    // Check if vehicle is already booked at this time
    const bookingDateTime = new Date(`${bookingDate}T${bookingTime}`);
    const isBooked = existingBookings.some(booking => {
      if (booking.vehicleId === vehicle.id && booking.status !== 'cancelled') {
        const existingDateTime = new Date(`${booking.bookingDate}T${booking.bookingTime}`);
        // Consider vehicle unavailable if booking is within 2 hours of requested time
        const timeDiff = Math.abs(bookingDateTime - existingDateTime);
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        return hoursDiff < 2;
      }
      return false;
    });
    
    return !isBooked && vehicle.available;
  });
  
  // Count vehicles by type
  const counts = {};
  availableVehicles.forEach(vehicle => {
    counts[vehicle.type] = (counts[vehicle.type] || 0) + 1;
  });
  
  return {
    available: availableVehicles,
    counts: counts,
    total: availableVehicles.length
  };
};

// Get vehicle type label
export const getVehicleTypeLabel = (type) => {
  const labels = {
    motorcycle: 'Motorcycle',
    auto: 'Auto',
    sedan: 'Sedan',
    suv: 'SUV',
    van: 'Van',
    bus: 'Bus',
    truck: 'Truck'
  };
  return labels[type] || type;
};

// Get vehicle type icon
export const getVehicleTypeIcon = (type) => {
  const icons = {
    motorcycle: '🏍️',
    auto: '🛺',
    sedan: '🚗',
    suv: '🚙',
    van: '🚐',
    bus: '🚌',
    truck: '🚚'
  };
  return icons[type] || '🚗';
};

