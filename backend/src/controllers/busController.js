import { store } from '../data/store.js';

export const getBuses = (req, res) => {
  try {
    const { routeId, status } = req.query;
    let buses = store.getAllBuses();

    if (routeId) {
      buses = buses.filter(b => b.routeId === routeId);
    }
    if (status) {
      buses = buses.filter(b => b.status === status);
    }

    res.json({ success: true, count: buses.length, data: buses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBusById = (req, res) => {
  try {
    const { id } = req.params;
    const bus = store.getBusById(id);
    if (!bus) {
      return res.status(404).json({ success: false, message: `Bus with ID ${id} not found` });
    }
    res.json({ success: true, data: bus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBus = (req, res) => {
  try {
    const busData = req.body;
    if (!busData.regNumber || !busData.routeId) {
      return res.status(400).json({ success: false, message: 'Registration Number and Route ID are required' });
    }
    const newBus = store.addBus(busData);
    res.status(201).json({ success: true, data: newBus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBus = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedBus = store.updateBus(id, updates);
    if (!updatedBus) {
      return res.status(404).json({ success: false, message: `Bus with ID ${id} not found` });
    }
    res.json({ success: true, data: updatedBus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBus = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = store.removeBus(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: `Bus with ID ${id} not found` });
    }
    res.json({ success: true, message: 'Bus deleted successfully', data: deleted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
