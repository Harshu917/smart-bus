import { store } from '../data/store.js';

export const getDriverDashboard = (req, res) => {
  try {
    const { busId } = req.params;
    const bus = store.getBusById(busId);
    if (!bus) {
      return res.status(404).json({ success: false, message: `Bus with ID ${busId} not found` });
    }

    const route = store.getRouteById(bus.routeId);
    const stops = store.getAllStops();
    const routeStops = route ? route.stops.map(sid => stops.find(s => s.id === sid)).filter(Boolean) : [];

    res.json({
      success: true,
      data: {
        bus,
        route,
        routeStops
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePassengerCount = (req, res) => {
  try {
    const { busId } = req.params;
    const { change, currentPassengers } = req.body;

    const bus = store.getBusById(busId);
    if (!bus) {
      return res.status(404).json({ success: false, message: `Bus ${busId} not found` });
    }

    let newPax = bus.currentPassengers;
    if (typeof currentPassengers === 'number') {
      newPax = currentPassengers;
    } else if (typeof change === 'number') {
      newPax = Math.max(0, Math.min(bus.capacity, bus.currentPassengers + change));
    }

    const updated = store.updateBus(busId, { currentPassengers: newPax });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
