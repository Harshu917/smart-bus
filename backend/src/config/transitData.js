/**
 * Initial Transit Data for Smart Bus Tracking System
 * Provides realistic geographical coordinates (lat/lng), bus stops, route paths, and fleet details.
 */

export const INITIAL_STOPS = [
  { id: 'stop-1', name: 'Central Grand Station', code: 'CGS', lat: 28.6139, lng: 77.2090, zone: 'Central', facilities: ['WiFi', 'Shelter', 'Digital Kiosk', 'Wheelchair Access'] },
  { id: 'stop-2', name: 'Connaught Financial Circle', code: 'CFC', lat: 28.6304, lng: 77.2177, zone: 'Central', facilities: ['Shelter', 'Digital Kiosk', 'Bicycle Dock'] },
  { id: 'stop-3', name: 'Tech Horizon Innovation Park', code: 'THP', lat: 28.6482, lng: 77.2285, zone: 'North-East', facilities: ['WiFi', 'Shelter', 'Cafe', 'EV Charging'] },
  { id: 'stop-4', name: 'Metropolitan University Campus', code: 'MUC', lat: 28.6650, lng: 77.2320, zone: 'North', facilities: ['Shelter', 'Book Drop', 'Digital Kiosk'] },
  { id: 'stop-5', name: 'Lotus Heritage Gate', code: 'LHG', lat: 28.5535, lng: 77.2588, zone: 'South', facilities: ['Tourist Info', 'WiFi', 'Shelter'] },
  { id: 'stop-6', name: 'Apollo Medical District', code: 'AMD', lat: 28.5350, lng: 77.2750, zone: 'South-East', facilities: ['Hospital Access', 'Shelter', 'Emergency Call Box'] },
  { id: 'stop-7', name: 'International Airport Terminal 3', code: 'IAT', lat: 28.5562, lng: 77.0999, zone: 'West', facilities: ['Baggage Help', 'WiFi', 'Currency Exch', 'Restroom'] },
  { id: 'stop-8', name: 'Cyber City Business Gateway', code: 'CCG', lat: 28.4900, lng: 77.0850, zone: 'South-West', facilities: ['Metro Transfer', 'WiFi', 'Shelter', 'Retail'] }
];

export const INITIAL_ROUTES = [
  {
    id: 'route-101',
    number: '101-EXPRESS',
    name: 'Downtown to Tech Horizon Corridor',
    color: '#3B82F6', // Blue
    category: 'Rapid Express',
    fareBase: 25,
    farePerKm: 3.5,
    stops: ['stop-1', 'stop-2', 'stop-3', 'stop-4'],
    waypoints: [
      { lat: 28.6139, lng: 77.2090 },
      { lat: 28.6210, lng: 77.2120 },
      { lat: 28.6304, lng: 77.2177 },
      { lat: 28.6390, lng: 77.2230 },
      { lat: 28.6482, lng: 77.2285 },
      { lat: 28.6560, lng: 77.2300 },
      { lat: 28.6650, lng: 77.2320 }
    ],
    schedule: {
      frequencyMins: 10,
      startTime: '05:30',
      endTime: '23:30'
    }
  },
  {
    id: 'route-204',
    number: '204-CROSS',
    name: 'Heritage South - Central Grand Link',
    color: '#10B981', // Emerald
    category: 'City Cross',
    fareBase: 20,
    farePerKm: 3.0,
    stops: ['stop-5', 'stop-6', 'stop-1', 'stop-2'],
    waypoints: [
      { lat: 28.5535, lng: 77.2588 },
      { lat: 28.5440, lng: 77.2660 },
      { lat: 28.5350, lng: 77.2750 },
      { lat: 28.5750, lng: 77.2400 },
      { lat: 28.6139, lng: 77.2090 },
      { lat: 28.6304, lng: 77.2177 }
    ],
    schedule: {
      frequencyMins: 15,
      startTime: '06:00',
      endTime: '22:45'
    }
  },
  {
    id: 'route-305',
    number: '305-FLY',
    name: 'Airport Terminal 3 SuperFast Flyover',
    color: '#8B5CF6', // Purple
    category: 'Airport Direct',
    fareBase: 60,
    farePerKm: 4.5,
    stops: ['stop-1', 'stop-8', 'stop-7'],
    waypoints: [
      { lat: 28.6139, lng: 77.2090 },
      { lat: 28.5800, lng: 77.1600 },
      { lat: 28.5300, lng: 77.1200 },
      { lat: 28.4900, lng: 77.0850 },
      { lat: 28.5200, lng: 77.0900 },
      { lat: 28.5562, lng: 77.0999 }
    ],
    schedule: {
      frequencyMins: 20,
      startTime: '04:00',
      endTime: '01:00'
    }
  },
  {
    id: 'route-402',
    number: '402-LOOP',
    name: 'University & Tech Hub Circuit',
    color: '#F59E0B', // Amber
    category: 'Circular Loop',
    fareBase: 15,
    farePerKm: 2.5,
    stops: ['stop-2', 'stop-3', 'stop-4', 'stop-1'],
    waypoints: [
      { lat: 28.6304, lng: 77.2177 },
      { lat: 28.6482, lng: 77.2285 },
      { lat: 28.6650, lng: 77.2320 },
      { lat: 28.6400, lng: 77.2100 },
      { lat: 28.6139, lng: 77.2090 },
      { lat: 28.6304, lng: 77.2177 }
    ],
    schedule: {
      frequencyMins: 12,
      startTime: '06:30',
      endTime: '22:00'
    }
  }
];

export const INITIAL_BUSES = [
  {
    id: 'bus-101',
    regNumber: 'DL-01-SB-1088',
    routeId: 'route-101',
    model: 'Volvo 7900 Electric Eco',
    capacity: 50,
    currentPassengers: 28,
    status: 'ACTIVE', // ACTIVE, DELAYED, MAINTENANCE, EMERGENCY
    speed: 38, // km/h
    currentStopIndex: 0,
    nextStopId: 'stop-2',
    etaNextStopSec: 180,
    heading: 45, // degrees
    lat: 28.6139,
    lng: 77.2090,
    pathProgress: 0.1, // percentage along route waypoint path (0 to 1)
    direction: 1, // 1 for forward, -1 for reverse
    driver: {
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      experienceYears: 8,
      rating: 4.9,
      badge: 'Certified EV Master'
    },
    telemetry: {
      batteryPercent: 86,
      indoorTempC: 22.5,
      doorStatus: 'CLOSED',
      fuelEfficiencyKmKwh: 1.2
    }
  },
  {
    id: 'bus-102',
    regNumber: 'DL-01-SB-2042',
    routeId: 'route-101',
    model: 'BYD K9 Pure Electric',
    capacity: 55,
    currentPassengers: 42,
    status: 'ACTIVE',
    speed: 32,
    currentStopIndex: 2,
    nextStopId: 'stop-4',
    etaNextStopSec: 240,
    heading: 30,
    lat: 28.6482,
    lng: 77.2285,
    pathProgress: 0.65,
    direction: 1,
    driver: {
      name: 'Amit Sharma',
      phone: '+91 98111 22334',
      experienceYears: 5,
      rating: 4.8,
      badge: 'Senior Pilot'
    },
    telemetry: {
      batteryPercent: 64,
      indoorTempC: 23.0,
      doorStatus: 'CLOSED',
      fuelEfficiencyKmKwh: 1.15
    }
  },
  {
    id: 'bus-201',
    regNumber: 'DL-02-SB-3301',
    routeId: 'route-204',
    model: 'Scania Citywide LF Smart',
    capacity: 60,
    currentPassengers: 35,
    status: 'ACTIVE',
    speed: 40,
    currentStopIndex: 1,
    nextStopId: 'stop-1',
    etaNextStopSec: 320,
    heading: 320,
    lat: 28.5350,
    lng: 77.2750,
    pathProgress: 0.35,
    direction: 1,
    driver: {
      name: 'Vikas Mehra',
      phone: '+91 97123 99887',
      experienceYears: 12,
      rating: 4.95,
      badge: 'Zero-Incident Fleet Master'
    },
    telemetry: {
      batteryPercent: 91,
      indoorTempC: 21.8,
      doorStatus: 'CLOSED',
      fuelEfficiencyKmKwh: 1.3
    }
  },
  {
    id: 'bus-301',
    regNumber: 'DL-03-SB-9900',
    routeId: 'route-305',
    model: 'Mercedes Citaro Hybrid Airport Lounge',
    capacity: 45,
    currentPassengers: 19,
    status: 'ACTIVE',
    speed: 55,
    currentStopIndex: 0,
    nextStopId: 'stop-8',
    etaNextStopSec: 450,
    heading: 210,
    lat: 28.6139,
    lng: 77.2090,
    pathProgress: 0.2,
    direction: 1,
    driver: {
      name: 'Deepak Verma',
      phone: '+91 99554 11223',
      experienceYears: 7,
      rating: 4.85,
      badge: 'Airport Express Specialist'
    },
    telemetry: {
      batteryPercent: 78,
      indoorTempC: 22.0,
      doorStatus: 'CLOSED',
      fuelEfficiencyKmKwh: 1.4
    }
  },
  {
    id: 'bus-401',
    regNumber: 'DL-04-SB-5520',
    routeId: 'route-402',
    model: 'Tata Starbus EV Urban',
    capacity: 40,
    currentPassengers: 38,
    status: 'ACTIVE',
    speed: 28,
    currentStopIndex: 1,
    nextStopId: 'stop-3',
    etaNextStopSec: 150,
    heading: 15,
    lat: 28.6304,
    lng: 77.2177,
    pathProgress: 0.45,
    direction: 1,
    driver: {
      name: 'Sunil Rathore',
      phone: '+91 98334 77665',
      experienceYears: 4,
      rating: 4.75,
      badge: 'Campus Connect Lead'
    },
    telemetry: {
      batteryPercent: 52,
      indoorTempC: 23.5,
      doorStatus: 'CLOSED',
      fuelEfficiencyKmKwh: 1.1
    }
  }
];

export const INITIAL_ALERTS = [
  {
    id: 'alert-1',
    type: 'INFO', // INFO, WARNING, EMERGENCY, DELAY
    title: 'Peak Hour Frequency Boost',
    message: 'Route 101-EXPRESS operating with extra buses every 8 minutes during morning rush.',
    affectedRouteId: 'route-101',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    priority: 'MEDIUM'
  },
  {
    id: 'alert-2',
    type: 'WARNING',
    title: 'Metro Junction Minor Congestion',
    message: 'Slow traffic near Connaught Financial Circle. Expected 3-5 minute delay on Route 204.',
    affectedRouteId: 'route-204',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    priority: 'HIGH'
  }
];
