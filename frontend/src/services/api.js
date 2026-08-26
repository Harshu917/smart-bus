const API_BASE = '/api';

export const api = {
  // Buses
  async getBuses(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/buses${query ? `?${query}` : ''}`);
    return res.json();
  },

  async getBusById(id) {
    const res = await fetch(`${API_BASE}/buses/${id}`);
    return res.json();
  },

  async createBus(busData) {
    const res = await fetch(`${API_BASE}/buses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(busData)
    });
    return res.json();
  },

  async updateBus(id, updates) {
    const res = await fetch(`${API_BASE}/buses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return res.json();
  },

  async deleteBus(id) {
    const res = await fetch(`${API_BASE}/buses/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Routes
  async getRoutes() {
    const res = await fetch(`${API_BASE}/routes`);
    return res.json();
  },

  async getRouteById(id) {
    const res = await fetch(`${API_BASE}/routes/${id}`);
    return res.json();
  },

  // Stops
  async getStops() {
    const res = await fetch(`${API_BASE}/stops`);
    return res.json();
  },

  // Tickets
  async createTicket(ticketData) {
    const res = await fetch(`${API_BASE}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData)
    });
    return res.json();
  },

  async getTickets() {
    const res = await fetch(`${API_BASE}/tickets`);
    return res.json();
  },

  async validateTicket(id) {
    const res = await fetch(`${API_BASE}/tickets/${id}/validate`, { method: 'POST' });
    return res.json();
  },

  // Alerts
  async getAlerts() {
    const res = await fetch(`${API_BASE}/alerts`);
    return res.json();
  },

  async createAlert(alertData) {
    const res = await fetch(`${API_BASE}/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alertData)
    });
    return res.json();
  },

  async deleteAlert(id) {
    const res = await fetch(`${API_BASE}/alerts/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Analytics
  async getAnalytics() {
    const res = await fetch(`${API_BASE}/analytics`);
    return res.json();
  },

  // Driver
  async getDriverDashboard(busId) {
    const res = await fetch(`${API_BASE}/driver/${busId}`);
    return res.json();
  },

  async updatePassengerCount(busId, change) {
    const res = await fetch(`${API_BASE}/driver/${busId}/passengers`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ change })
    });
    return res.json();
  }
};
