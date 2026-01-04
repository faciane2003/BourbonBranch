const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

async function request(path, options) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }
  return response.json();
}

export function fetchProducts() {
  return request("/api/products");
}

export function fetchCustomers() {
  return request("/api/customers");
}

export function fetchOrders() {
  return request("/api/orders");
}
