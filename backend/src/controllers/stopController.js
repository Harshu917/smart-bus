import { store } from '../data/store.js';

export const getStops = (req, res) => {
  try {
    const stops = store.getAllStops();
    const routes = store.getAllRoutes();

    // Map which routes serve each stop
    const enrichedStops = stops.map(stop => ({
      ...stop,
      servedByRoutes: routes
        .filter(r => r.stops.includes(stop.id))
        .map(r => ({ id: r.id, number: r.number, name: r.name, color: r.color }))
    }));

    res.json({ success: true, count: enrichedStops.length, data: enrichedStops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStopById = (req, res) => {
  try {
    const { id } = req.params;
    const stop = store.getStopById(id);
    if (!stop) {
      return res.status(404).json({ success: false, message: `Stop with ID ${id} not found` });
    }

    const routes = store.getAllRoutes().filter(r => r.stops.includes(id));
    const nearbyBuses = store.getAllBuses().filter(b => routes.some(r => r.id === b.routeId));

    res.json({
      success: true,
      data: {
        ...stop,
        servedByRoutes: routes.map(r => ({ id: r.id, number: r.number, name: r.name, color: r.color })),
        approachingBuses: nearbyBuses
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
