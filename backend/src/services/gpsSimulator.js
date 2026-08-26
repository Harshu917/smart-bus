import { store } from '../data/store.js';

/**
 * Calculates bearing between two lat/lng coordinates
 */
function calculateHeading(lat1, lon1, lat2, lon2) {
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const y = Math.sin(dLon) * Math.cos(lat2 * (Math.PI / 180));
  const x =
    Math.cos(lat1 * (Math.PI / 180)) * Math.sin(lat2 * (Math.PI / 180)) -
    Math.sin(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.cos(dLon);
  let brng = Math.atan2(y, x) * (180 / Math.PI);
  return (brng + 360) % 360;
}

/**
 * Interpolates coordinate along waypoints path based on progress (0 to 1)
 */
function interpolatePosition(waypoints, progress) {
  if (!waypoints || waypoints.length === 0) return { lat: 28.6139, lng: 77.2090, heading: 0 };
  if (waypoints.length === 1) return { ...waypoints[0], heading: 0 };

  const totalSegments = waypoints.length - 1;
  const scaledProgress = Math.max(0, Math.min(1, progress)) * totalSegments;
  const segmentIndex = Math.min(Math.floor(scaledProgress), totalSegments - 1);
  const segmentProgress = scaledProgress - segmentIndex;

  const p1 = waypoints[segmentIndex];
  const p2 = waypoints[segmentIndex + 1];

  const lat = p1.lat + (p2.lat - p1.lat) * segmentProgress;
  const lng = p1.lng + (p2.lng - p1.lng) * segmentProgress;
  const heading = calculateHeading(p1.lat, p1.lng, p2.lat, p2.lng);

  return { lat, lng, heading };
}

export class GPSSimulator {
  constructor(io, intervalMs = 2000) {
    this.io = io;
    this.intervalMs = intervalMs;
    this.timer = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log(`[GPS Simulator] Started real-time tracking engine (Interval: ${this.intervalMs}ms)`);

    this.timer = setInterval(() => {
      this.tick();
    }, this.intervalMs);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
    console.log('[GPS Simulator] Stopped');
  }

  tick() {
    const buses = store.getAllBuses();
    const routes = store.getAllRoutes();
    const stops = store.getAllStops();

    const updatedBuses = buses.map(bus => {
      // If bus is in maintenance or emergency, keep location static
      if (bus.status === 'MAINTENANCE') {
        return bus;
      }

      const route = routes.find(r => r.id === bus.routeId);
      if (!route || !route.waypoints || route.waypoints.length === 0) {
        return bus;
      }

      // Step progress forward or backward
      const stepDelta = 0.015 + (Math.random() * 0.008);
      let newProgress = bus.pathProgress + (stepDelta * (bus.direction || 1));

      let newDirection = bus.direction || 1;
      if (newProgress >= 1.0) {
        newProgress = 1.0;
        newDirection = -1; // Reverse route path
      } else if (newProgress <= 0.0) {
        newProgress = 0.0;
        newDirection = 1; // Forward route path
      }

      const { lat, lng, heading } = interpolatePosition(route.waypoints, newProgress);

      // Dynamic speed simulation (between 25 km/h and 55 km/h)
      const speedVariation = (Math.random() - 0.5) * 6;
      let newSpeed = Math.round(Math.max(18, Math.min(60, bus.speed + speedVariation)));

      // Determine upcoming stop along route
      const routeStopIds = route.stops || [];
      const stopIndex = Math.min(
        Math.floor(newProgress * routeStopIds.length),
        routeStopIds.length - 1
      );
      const nextStopId = routeStopIds[(stopIndex + 1) % routeStopIds.length] || routeStopIds[0];

      // ETA to next stop in seconds (based on speed & remaining segment progress)
      const remainingProgressInSegment = (newProgress * routeStopIds.length) % 1;
      const etaNextStopSec = Math.max(30, Math.round((1 - remainingProgressInSegment) * 300));

      // Simulate passenger boarding/alighting occasionally near stop intervals
      let passengers = bus.currentPassengers;
      if (Math.random() > 0.65) {
        const deltaPassengers = Math.floor(Math.random() * 7) - 3; // -3 to +3
        passengers = Math.max(5, Math.min(bus.capacity, passengers + deltaPassengers));
      }

      // Slightly drain battery for EV telemetry
      let battery = bus.telemetry?.batteryPercent || 80;
      if (Math.random() > 0.95 && battery > 10) {
        battery -= 1;
      }

      const updated = store.updateBus(bus.id, {
        lat,
        lng,
        heading: Math.round(heading),
        pathProgress: newProgress,
        direction: newDirection,
        speed: newSpeed,
        currentStopIndex: stopIndex,
        nextStopId,
        etaNextStopSec,
        currentPassengers: passengers,
        telemetry: {
          ...bus.telemetry,
          batteryPercent: battery
        }
      });

      return updated || bus;
    });

    // Broadcast live telemetry & bus updates to all connected Socket.io clients
    if (this.io) {
      this.io.emit('buses:live_update', updatedBuses);
      this.io.emit('analytics:update', store.getAnalytics());
    }
  }
}
