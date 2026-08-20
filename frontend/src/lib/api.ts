// Backend URL FastAPI
const API_URL = "http://localhost:8000";

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  
  // get token from localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;


  // add 'Bearer token' automatically if user is logged in
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };


  // credentials: "include" to receive the httpOnly cookie (refresh_token)
  const response = await fetch(`${API_URL}${endpoint}`, {
    credentials: "include",
    ...options,
    headers,
  });


  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Error in backend request");
  }


  // Logout (return null) 
  if (response.status === 204) {
    return null; 
  }
  
  return response.json();
}
