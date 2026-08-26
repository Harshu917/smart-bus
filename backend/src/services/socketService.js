import { store } from '../data/store.js';

export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Send initial snapshot on connection
    socket.emit('transit:initial_state', {
      buses: store.getAllBuses(),
      routes: store.getAllRoutes(),
      stops: store.getAllStops(),
      alerts: store.getAllAlerts(),
      analytics: store.getAnalytics()
    });

    // Driver telemetry updates
    socket.on('driver:update_telemetry', (data) => {
      const { busId, passengers, speed, status } = data;
      const bus = store.getBusById(busId);
      if (bus) {
        const updates = {};
        if (passengers !== undefined) updates.currentPassengers = passengers;
        if (speed !== undefined) updates.speed = speed;
        if (status !== undefined) updates.status = status;
        const updated = store.updateBus(busId, updates);
        io.emit('bus:single_update', updated);
        io.emit('analytics:update', store.getAnalytics());
      }
    });

    // Emergency SOS Trigger
    socket.on('emergency:sos_trigger', (data) => {
      const { busId, reason, driverName } = data;
      const bus = store.getBusById(busId);
      if (bus) {
        store.updateBus(busId, { status: 'EMERGENCY' });
        const alert = store.addAlert({
          type: 'EMERGENCY',
          title: `EMERGENCY SOS: Bus ${bus.regNumber}`,
          message: `${reason || 'Emergency Assistance Requested'} by Driver ${driverName || bus.driver.name}. Coordinates: ${bus.lat.toFixed(4)}, ${bus.lng.toFixed(4)}`,
          affectedRouteId: bus.routeId,
          priority: 'CRITICAL'
        });
        io.emit('emergency:sos_broadcast', { bus, alert });
        io.emit('buses:live_update', store.getAllBuses());
        io.emit('alerts:update', store.getAllAlerts());
      }
    });

    // Admin Broadcast Announcement
    socket.on('admin:broadcast_alert', (alertData) => {
      const alert = store.addAlert(alertData);
      io.emit('alerts:new_broadcast', alert);
      io.emit('alerts:update', store.getAllAlerts());
    });

    // Passenger Ticket Booking notification
    socket.on('passenger:new_booking', (ticketData) => {
      const ticket = store.createTicket(ticketData);
      socket.emit('ticket:booking_success', ticket);
      io.emit('analytics:update', store.getAnalytics());
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });
}
