import { store } from '../data/store.js';

export const getRoutes = (req, res) => {
  try {
    const routes = store.getAllRoutes();
    const stops = store.getAllStops();

    // Populate route stops with full stop details
    const populated = routes.map(route => ({
      ...route,
      stopsData: route.stops.map(stopId => stops.find(s => s.id === stopId)).filter(Boolean)
    }));

    res.json({ success: true, count: populated.length, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRouteById = (req, res) => {
  try {
    const { id } = req.params;
    const route = store.getRouteById(id);
    if (!route) {
      return res.status(404).json({ success: false, message: `Route with ID ${id} not found` });
    }

    const stops = store.getAllStops();
    const activeBuses = store.getAllBuses().filter(b => b.routeId === id);

    const populated = {
      ...route,
      stopsData: route.stops.map(stopId => stops.find(s => s.id === stopId)).filter(Boolean),
      activeBuses
    };

    res.json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
