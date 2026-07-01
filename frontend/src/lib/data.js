import axios from 'axios';
import { products as mockProducts, reviews as mockReviews } from '../mock';

/**
 * Data layer with graceful fallback.
 *
 * When REACT_APP_BACKEND_URL points at a running FastAPI backend, we use the
 * live API (products, reviews, orders). When it is unset or unreachable — e.g.
 * the standalone Vercel deployment — we fall back to the bundled catalog so the
 * storefront is always fully browsable and orders "complete" in demo mode.
 */

const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || '').trim();
const API = BACKEND_URL ? `${BACKEND_URL}/api` : '';

export const isLiveBackend = Boolean(BACKEND_URL);

const TIMEOUT = 6000;

export async function fetchProducts() {
  if (!API) return { data: mockProducts, demo: true };
  try {
    const res = await axios.get(`${API}/products`, { timeout: TIMEOUT });
    if (Array.isArray(res.data) && res.data.length) return { data: res.data, demo: false };
    return { data: mockProducts, demo: true };
  } catch {
    return { data: mockProducts, demo: true };
  }
}

export async function fetchReviews() {
  if (!API) return { data: mockReviews, demo: true };
  try {
    const res = await axios.get(`${API}/reviews`, { timeout: TIMEOUT });
    if (Array.isArray(res.data) && res.data.length) return { data: res.data, demo: false };
    return { data: mockReviews, demo: true };
  } catch {
    return { data: mockReviews, demo: true };
  }
}

export async function submitOrder(orderData) {
  if (!API) {
    return { data: { id: `demo-${Date.now()}`, ...orderData, status: 'pending' }, demo: true };
  }
  try {
    const res = await axios.post(`${API}/orders`, orderData, { timeout: TIMEOUT });
    return { data: res.data, demo: false };
  } catch (error) {
    // In demo/offline mode we still confirm the order client-side.
    return { data: { id: `demo-${Date.now()}`, ...orderData, status: 'pending' }, demo: true };
  }
}
