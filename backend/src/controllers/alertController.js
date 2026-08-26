import { store } from '../data/store.js';

export const getAlerts = (req, res) => {
  try {
    const alerts = store.getAllAlerts();
    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAlert = (req, res) => {
  try {
    const { title, message, type, priority, affectedRouteId } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required' });
    }

    const alert = store.addAlert({ title, message, type, priority, affectedRouteId });
    res.status(201).json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAlert = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = store.dismissAlert(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: `Alert ${id} not found` });
    }
    res.json({ success: true, message: 'Alert dismissed', data: deleted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
