import { store } from '../data/store.js';

export const getAnalytics = (req, res) => {
  try {
    const stats = store.getAnalytics();
    const buses = store.getAllBuses();
    const routes = store.getAllRoutes();

    // Fleet hourly peak simulation
    const hourlyTraffic = [
      { hour: '06:00', passengers: 45, onTimeRate: 98 },
      { hour: '08:00', passengers: 180, onTimeRate: 92 },
      { hour: '10:00', passengers: 140, onTimeRate: 95 },
      { hour: '12:00', passengers: 95, onTimeRate: 97 },
      { hour: '14:00', passengers: 110, onTimeRate: 96 },
      { hour: '17:00', passengers: 210, onTimeRate: 89 },
      { hour: '19:00', passengers: 165, onTimeRate: 91 },
      { hour: '21:00', passengers: 75, onTimeRate: 99 }
    ];

    const routePerformance = routes.map(r => {
      const routeBuses = buses.filter(b => b.routeId === r.id);
      const avgPax = routeBuses.reduce((s, b) => s + b.currentPassengers, 0);
      return {
        routeId: r.id,
        number: r.number,
        name: r.name,
        color: r.color,
        activeVehicles: routeBuses.length,
        currentPax: avgPax,
        efficiencyScore: 94
      };
    });

    res.json({
      success: true,
      data: {
        ...stats,
        hourlyTraffic,
        routePerformance
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
