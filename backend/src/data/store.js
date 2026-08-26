import { INITIAL_BUSES, INITIAL_ROUTES, INITIAL_STOPS, INITIAL_ALERTS } from '../config/transitData.js';

class TransitStore {
  constructor() {
    this.buses = JSON.parse(JSON.stringify(INITIAL_BUSES));
    this.routes = JSON.parse(JSON.stringify(INITIAL_ROUTES));
    this.stops = JSON.parse(JSON.stringify(INITIAL_STOPS));
    this.alerts = JSON.parse(JSON.stringify(INITIAL_ALERTS));
    this.tickets = [];
    this.historyLogs = [];
    this.systemStats = {
      totalBookings: 142,
      totalRevenue: 4850,
      carbonSavedKg: 1240.5,
      activePassengers: 162
    };
  }

  getAllBuses() {
    return this.buses;
  }

  getBusById(id) {
    return this.buses.find(b => b.id === id);
  }

  updateBus(id, updates) {
    const index = this.buses.findIndex(b => b.id === id);
    if (index !== -1) {
      this.buses[index] = { ...this.buses[index], ...updates };
      return this.buses[index];
    }
    return null;
  }

  addBus(busData) {
    const newBus = {
      id: `bus-${Date.now().toString().slice(-4)}`,
      regNumber: busData.regNumber || `DL-01-SB-${Math.floor(1000 + Math.random() * 9000)}`,
      routeId: busData.routeId || this.routes[0].id,
      model: busData.model || 'Standard Eco Bus',
      capacity: parseInt(busData.capacity || 50, 10),
      currentPassengers: 0,
      status: 'ACTIVE',
      speed: 35,
      currentStopIndex: 0,
      nextStopId: this.routes.find(r => r.id === busData.routeId)?.stops[1] || 'stop-2',
      etaNextStopSec: 200,
      heading: 0,
      lat: 28.6139,
      lng: 77.2090,
      pathProgress: 0.0,
      direction: 1,
      driver: {
        name: busData.driverName || 'Designated Driver',
        phone: busData.driverPhone || '+91 90000 00000',
        experienceYears: 3,
        rating: 5.0,
        badge: 'Transit Operator'
      },
      telemetry: {
        batteryPercent: 100,
        indoorTempC: 22.0,
        doorStatus: 'CLOSED',
        fuelEfficiencyKmKwh: 1.2
      }
    };
    this.buses.push(newBus);
    return newBus;
  }

  removeBus(id) {
    const index = this.buses.findIndex(b => b.id === id);
    if (index !== -1) {
      return this.buses.splice(index, 1)[0];
    }
    return null;
  }

  getAllRoutes() {
    return this.routes;
  }

  getRouteById(id) {
    return this.routes.find(r => r.id === id);
  }

  getAllStops() {
    return this.stops;
  }

  getStopById(id) {
    return this.stops.find(s => s.id === id);
  }

  getAllAlerts() {
    return this.alerts;
  }

  addAlert(alertData) {
    const newAlert = {
      id: `alert-${Date.now()}`,
      type: alertData.type || 'INFO',
      title: alertData.title,
      message: alertData.message,
      affectedRouteId: alertData.affectedRouteId || null,
      priority: alertData.priority || 'MEDIUM',
      timestamp: new Date().toISOString()
    };
    this.alerts.unshift(newAlert);
    return newAlert;
  }

  dismissAlert(id) {
    const index = this.alerts.findIndex(a => a.id === id);
    if (index !== -1) {
      return this.alerts.splice(index, 1)[0];
    }
    return null;
  }

  createTicket(ticketData) {
    const newTicket = {
      id: `TKT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      passengerName: ticketData.passengerName || 'Commuter',
      passengerEmail: ticketData.passengerEmail || '',
      passengerPhone: ticketData.passengerPhone || '',
      routeId: ticketData.routeId,
      busId: ticketData.busId || null,
      originStopId: ticketData.originStopId,
      destinationStopId: ticketData.destinationStopId,
      seatCount: parseInt(ticketData.seatCount || 1, 10),
      fareTotal: parseFloat(ticketData.fareTotal || 25),
      bookingTime: new Date().toISOString(),
      status: 'CONFIRMED', // CONFIRMED, VALIDATED, CANCELLED
      qrCodeData: JSON.stringify({
        tId: `TKT-${Date.now()}`,
        p: ticketData.passengerName,
        r: ticketData.routeId,
        from: ticketData.originStopId,
        to: ticketData.destinationStopId,
        seats: ticketData.seatCount || 1,
        issued: new Date().toISOString()
      })
    };
    this.tickets.unshift(newTicket);
    this.systemStats.totalBookings += 1;
    this.systemStats.totalRevenue += newTicket.fareTotal;
    return newTicket;
  }

  getTickets() {
    return this.tickets;
  }

  getTicketById(id) {
    return this.tickets.find(t => t.id === id);
  }

  validateTicket(id) {
    const ticket = this.tickets.find(t => t.id === id);
    if (ticket) {
      ticket.status = 'VALIDATED';
      ticket.validatedAt = new Date().toISOString();
      return ticket;
    }
    return null;
  }

  getAnalytics() {
    const totalPassengers = this.buses.reduce((sum, b) => sum + (b.currentPassengers || 0), 0);
    const totalCapacity = this.buses.reduce((sum, b) => sum + (b.capacity || 50), 0);
    const activeBusesCount = this.buses.filter(b => b.status === 'ACTIVE').length;
    const delayedBusesCount = this.buses.filter(b => b.status === 'DELAYED').length;

    return {
      activeBuses: activeBusesCount,
      totalBuses: this.buses.length,
      delayedBuses: delayedBusesCount,
      totalPassengers,
      totalCapacity,
      fleetOccupancyPercent: totalCapacity > 0 ? Math.round((totalPassengers / totalCapacity) * 100) : 0,
      totalRoutes: this.routes.length,
      totalStops: this.stops.length,
      activeAlertsCount: this.alerts.length,
      totalBookings: this.systemStats.totalBookings,
      totalRevenue: this.systemStats.totalRevenue,
      carbonSavedKg: this.systemStats.carbonSavedKg,
      recentAlerts: this.alerts.slice(0, 3)
    };
  }
}

export const store = new TransitStore();
