import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { socket } from '../services/socket';
import { api } from '../services/api';

const TransitContext = createContext();

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

  // Initial Fetch & Socket Setup
  useEffect(() => {
    const handleConnect = () => {
      console.log('[TransitContext] Socket Connected');
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log('[TransitContext] Socket Disconnected');
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
        console.error('[TransitContext] Fetch fallback error:', err);
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
        socket.emit('passenger:new_booking', bookingData);
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
    socket.emit('emergency:sos_trigger', {
      busId,
      reason,
      driverName: bus?.driver?.name || 'Driver'
    });
  };

  const broadcastAlert = async (alertData) => {
    try {
      const res = await api.createAlert(alertData);
      if (res.success) {
        socket.emit('admin:broadcast_alert', alertData);
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
