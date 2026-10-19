const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem('wanderlust_token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

export const api = {
  // Auth
  async signup(data) {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async login(data) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getCurrentUser() {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  // Mapbox Token
  async getMapboxToken() {
    try {
      const res = await fetch(`${API_URL}/config/mapbox-token`);
      const data = await res.json();
      return data.token;
    } catch {
      return '';
    }
  },

  // Listings
  async getListings(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/listings?${query}`);
    return res.json();
  },

  async getListingById(id) {
    const res = await fetch(`${API_URL}/listings/${id}`);
    return res.json();
  },

  async createListing(formData) {
    const res = await fetch(`${API_URL}/listings`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
    return res.json();
  },

  async updateListing(id, formData) {
    const res = await fetch(`${API_URL}/listings/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: formData,
    });
    return res.json();
  },

  async deleteListing(id) {
    const res = await fetch(`${API_URL}/listings/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },

  // Reviews
  async addReview(listingId, reviewData) {
    const res = await fetch(`${API_URL}/listings/${listingId}/reviews`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reviewData),
    });
    return res.json();
  },

  async deleteReview(listingId, reviewId) {
    const res = await fetch(`${API_URL}/listings/${listingId}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  },
};
