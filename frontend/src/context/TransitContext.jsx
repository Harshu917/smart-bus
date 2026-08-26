import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { socket } from '../services/socket';
import { api } from '../services/api';

const TransitContext = createContext();

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

export const TransitProvider = ({ children }) => {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [tickets, setTickets] = useState([]);
  
  // Active UI Navigation State
  const [activePortal, setActivePortal] = useState('passenger'); // 'passenger' | 'driver' | 'admin'
  const [selectedRouteId, setSelectedRouteId] = useState('all');
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [selectedStopId, setSelectedStopId] = useState(null);
  
  // Real-time notification toast/banner
  const [activeNotification, setActiveNotification] = useState(null);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isLoading, setIsLoading] = useState(true);

  // Ref to hold current routes for client-side simulator
  const routesRef = useRef(routes);
  useEffect(() => {
    routesRef.current = routes;
  }, [routes]);

  // Initial Fetch & Socket Setup
  useEffect(() => {
    const handleConnect = () => {
      console.log('[TransitContext] Socket Connected');
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log('[TransitContext] Socket Disconnected / Standalone Mode');
      setIsConnected(false);
    };

    const handleInitialState = (state) => {
      if (state.buses) setBuses(state.buses);
      if (state.routes) setRoutes(state.routes);
      if (state.stops) setStops(state.stops);
      if (state.alerts) setAlerts(state.alerts);
      if (state.analytics) setAnalytics(state.analytics);
      setIsLoading(false);
    };

    const handleBusesUpdate = (updatedBuses) => {
      setBuses(updatedBuses);
    };

    const handleAnalyticsUpdate = (updatedAnalytics) => {
      setAnalytics(updatedAnalytics);
    };

    const handleAlertsUpdate = (updatedAlerts) => {
      setAlerts(updatedAlerts);
    };

    const handleNewBroadcast = (newAlert) => {
      setAlerts(prev => [newAlert, ...prev]);
      setActiveNotification({
        type: newAlert.type,
        title: newAlert.title,
        message: newAlert.message,
        id: newAlert.id
      });
    };

    const handleEmergencySOS = ({ bus, alert }) => {
      setActiveNotification({
        type: 'EMERGENCY',
        title: `🚨 CRITICAL SOS: Bus ${bus.regNumber}`,
        message: alert.message,
        id: alert.id
      });
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('transit:initial_state', handleInitialState);
    socket.on('buses:live_update', handleBusesUpdate);
    socket.on('analytics:update', handleAnalyticsUpdate);
    socket.on('alerts:update', handleAlertsUpdate);
    socket.on('alerts:new_broadcast', handleNewBroadcast);
    socket.on('emergency:sos_broadcast', handleEmergencySOS);

    // Initial fallback REST API fetch
    const fetchInitialData = async () => {
      try {
        const [busesRes, routesRes, stopsRes, alertsRes, analyticsRes, ticketsRes] = await Promise.all([
          api.getBuses(),
          api.getRoutes(),
          api.getStops(),
          api.getAlerts(),
          api.getAnalytics(),
          api.getTickets()
        ]);

        if (busesRes.success) setBuses(busesRes.data);
        if (routesRes.success) setRoutes(routesRes.data);
        if (stopsRes.success) setStops(stopsRes.data);
        if (alertsRes.success) setAlerts(alertsRes.data);
        if (analyticsRes.success) setAnalytics(analyticsRes.data);
        if (ticketsRes.success) setTickets(ticketsRes.data);
      } catch (err) {
        console.error('[TransitContext] Fetch initial data error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('transit:initial_state', handleInitialState);
      socket.off('buses:live_update', handleBusesUpdate);
      socket.off('analytics:update', handleAnalyticsUpdate);
      socket.off('alerts:update', handleAlertsUpdate);
      socket.off('alerts:new_broadcast', handleNewBroadcast);
      socket.off('emergency:sos_broadcast', handleEmergencySOS);
    };
  }, []);

  // Client-Side GPS Simulation Engine when WebSockets are offline/serverless (e.g. Vercel)
  useEffect(() => {
    if (isConnected || isLoading || buses.length === 0) return;

    const interval = setInterval(() => {
      setBuses(prevBuses => {
        const currentRoutes = routesRef.current;
        return prevBuses.map(bus => {
          if (bus.status === 'MAINTENANCE') return bus;

          const route = currentRoutes.find(r => r.id === bus.routeId);
          if (!route || !route.waypoints || route.waypoints.length === 0) return bus;

          const stepDelta = 0.015 + (Math.random() * 0.008);
          let newProgress = (bus.pathProgress || 0) + (stepDelta * (bus.direction || 1));
          let newDirection = bus.direction || 1;

          if (newProgress >= 1.0) {
            newProgress = 1.0;
            newDirection = -1;
          } else if (newProgress <= 0.0) {
            newProgress = 0.0;
            newDirection = 1;
          }

          const { lat, lng, heading } = interpolatePosition(route.waypoints, newProgress);
          const speedVariation = (Math.random() - 0.5) * 6;
          const newSpeed = Math.round(Math.max(18, Math.min(60, (bus.speed || 35) + speedVariation)));

          const routeStopIds = route.stops || [];
          const stopIndex = Math.min(
            Math.floor(newProgress * (routeStopIds.length || 1)),
            Math.max(0, routeStopIds.length - 1)
          );
          const nextStopId = routeStopIds[(stopIndex + 1) % (routeStopIds.length || 1)] || routeStopIds[0] || 'stop-1';
          const remainingProgressInSegment = (newProgress * (routeStopIds.length || 1)) % 1;
          const etaNextStopSec = Math.max(30, Math.round((1 - remainingProgressInSegment) * 300));

          let passengers = bus.currentPassengers || 0;
          if (Math.random() > 0.7) {
            const delta = Math.floor(Math.random() * 5) - 2;
            passengers = Math.max(5, Math.min(bus.capacity || 50, passengers + delta));
          }

          let battery = bus.telemetry?.batteryPercent || 85;
          if (Math.random() > 0.95 && battery > 15) {
            battery -= 1;
          }

          return {
            ...bus,
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
          };
        });
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isConnected, isLoading, buses.length]);

  // Periodic REST Sync when WebSockets are offline
  useEffect(() => {
    if (isConnected || isLoading) return;

    const pollInterval = setInterval(async () => {
      try {
        const [alertsRes, analyticsRes] = await Promise.all([
          api.getAlerts(),
          api.getAnalytics()
        ]);
        if (alertsRes.success) setAlerts(alertsRes.data);
        if (analyticsRes.success) setAnalytics(analyticsRes.data);
      } catch (err) {
        // Silently catch background poll error
      }
    }, 10000);

    return () => clearInterval(pollInterval);
  }, [isConnected, isLoading]);

  // Filtered Buses according to selected route
  const filteredBuses = useCallback(() => {
    if (selectedRouteId === 'all') return buses;
    return buses.filter(b => b.routeId === selectedRouteId);
  }, [buses, selectedRouteId]);

  // Actions
  const bookTicket = async (bookingData) => {
    try {
      const res = await api.createTicket(bookingData);
      if (res.success) {
        setTickets(prev => [res.data, ...prev]);
        if (socket.connected) {
          socket.emit('passenger:new_booking', bookingData);
        }
        return res.data;
      }
      throw new Error(res.message || 'Failed to book ticket');
    } catch (err) {
      console.error('[TransitContext] Book ticket error:', err);
      throw err;
    }
  };

  const triggerEmergencySOS = (busId, reason = 'Emergency Stop Requested') => {
    const bus = buses.find(b => b.id === busId);
    if (socket.connected) {
      socket.emit('emergency:sos_trigger', {
        busId,
        reason,
        driverName: bus?.driver?.name || 'Driver'
      });
    } else {
      // Local fallback trigger
      setBuses(prev => prev.map(b => b.id === busId ? { ...b, status: 'EMERGENCY' } : b));
      const newAlert = {
        id: `alert-${Date.now()}`,
        type: 'EMERGENCY',
        title: `🚨 CRITICAL SOS: Bus ${bus?.regNumber || busId}`,
        message: `${reason} by Driver ${bus?.driver?.name || 'Assigned Driver'}.`,
        priority: 'CRITICAL',
        timestamp: new Date().toISOString()
      };
      setAlerts(prev => [newAlert, ...prev]);
      setActiveNotification(newAlert);
    }
  };

  const broadcastAlert = async (alertData) => {
    try {
      const res = await api.createAlert(alertData);
      if (res.success) {
        setAlerts(prev => [res.data, ...prev]);
        if (socket.connected) {
          socket.emit('admin:broadcast_alert', alertData);
        }
        setActiveNotification({
          type: res.data.type,
          title: res.data.title,
          message: res.data.message,
          id: res.data.id
        });
        return res.data;
      }
      throw new Error(res.message || 'Failed to broadcast alert');
    } catch (err) {
      console.error('[TransitContext] Broadcast alert error:', err);
      throw err;
    }
  };

  const updateBusStatus = async (busId, updates) => {
    try {
      const res = await api.updateBus(busId, updates);
      if (res.success) {
        setBuses(prev => prev.map(b => b.id === busId ? res.data : b));
        return res.data;
      }
    } catch (err) {
      console.error('[TransitContext] Update bus status error:', err);
    }
  };

  const addNewBus = async (busData) => {
    try {
      const res = await api.createBus(busData);
      if (res.success) {
        setBuses(prev => [...prev, res.data]);
        return res.data;
      }
    } catch (err) {
      console.error('[TransitContext] Add new bus error:', err);
      throw err;
    }
  };

  const deleteBus = async (busId) => {
    try {
      const res = await api.deleteBus(busId);
      if (res.success) {
        setBuses(prev => prev.filter(b => b.id !== busId));
        if (selectedBusId === busId) setSelectedBusId(null);
        return true;
      }
    } catch (err) {
      console.error('[TransitContext] Delete bus error:', err);
    }
  };

  const dismissNotification = () => {
    setActiveNotification(null);
  };

  return (
    <TransitContext.Provider
      value={{
        buses,
        routes,
        stops,
        alerts,
        analytics,
        tickets,
        filteredBuses: filteredBuses(),
        activePortal,
        setActivePortal,
        selectedRouteId,
        setSelectedRouteId,
        selectedBusId,
        setSelectedBusId,
        selectedStopId,
        setSelectedStopId,
        activeNotification,
        dismissNotification,
        isConnected,
        isLoading,
        bookTicket,
        triggerEmergencySOS,
        broadcastAlert,
        updateBusStatus,
        addNewBus,
        deleteBus
      }}
    >
      {children}
    </TransitContext.Provider>
  );
};

export const useTransit = () => {
  const context = useContext(TransitContext);
  if (!context) {
    throw new Error('useTransit must be used within a TransitProvider');
  }
  return context;
};
