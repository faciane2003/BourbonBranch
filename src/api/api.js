const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

async function request(path, options) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }
  return response.json();
}

export function fetchProducts(scope) {
  const query = scope ? `?scope=${encodeURIComponent(scope)}` : "";
  return request(`/api/products${query}`);
}

export function fetchHealth() {
  return request("/health/db");
}

export function fetchCustomers() {
  return request("/api/customers");
}

export function fetchOrders() {
  return request("/api/orders");
}

export function createProduct(payload) {
  return request("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export function updateProduct(id, payload) {
  return request(`/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export function deleteProduct(id) {
  return request(`/api/products/${id}`, { method: "DELETE" });
}

export function createCustomer(payload) {
  return request("/api/customers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export function updateCustomer(id, payload) {
  return request(`/api/customers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export function deleteCustomer(id) {
  return request(`/api/customers/${id}`, { method: "DELETE" });
}

export function createOrder(payload) {
  return request("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export function updateOrder(id, payload) {
  return request(`/api/orders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export function deleteOrder(id) {
  return request(`/api/orders/${id}`, { method: "DELETE" });
}
