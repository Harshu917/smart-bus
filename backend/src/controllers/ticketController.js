import { store } from '../data/store.js';

export const createTicket = (req, res) => {
  try {
    const { passengerName, routeId, originStopId, destinationStopId, seatCount } = req.body;

    if (!passengerName || !routeId || !originStopId || !destinationStopId) {
      return res.status(400).json({
        success: false,
        message: 'passengerName, routeId, originStopId, and destinationStopId are required'
      });
    }

    const route = store.getRouteById(routeId);
    if (!route) {
      return res.status(404).json({ success: false, message: 'Invalid routeId provided' });
    }

    const originIdx = route.stops.indexOf(originStopId);
    const destIdx = route.stops.indexOf(destinationStopId);
    const stopsDistance = Math.max(1, Math.abs(destIdx - originIdx));
    const calculatedFare = (route.fareBase + (stopsDistance * route.farePerKm * 2.5)) * (parseInt(seatCount || 1, 10));

    const ticket = store.createTicket({
      ...req.body,
      fareTotal: Math.round(calculatedFare)
    });

    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTickets = (req, res) => {
  try {
    const tickets = store.getTickets();
    res.json({ success: true, count: tickets.length, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTicketById = (req, res) => {
  try {
    const { id } = req.params;
    const ticket = store.getTicketById(id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: `Ticket ${id} not found` });
    }
    res.json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const validateTicket = (req, res) => {
  try {
    const { id } = req.params;
    const ticket = store.validateTicket(id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: `Ticket ${id} not found` });
    }
    res.json({ success: true, message: 'Ticket validated successfully', data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
