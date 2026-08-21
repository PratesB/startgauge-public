// Backend URL FastAPI
const API_URL = "http://localhost:8000";

export async function fetchAPI(endpoint: string, options: RequestInit = {}, _isRetry = false): Promise<any> {
  
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


  // Handle Token Expiration (401 Unauthorized)
  if (response.status === 401 && !_isRetry && endpoint !== "/api/v1/users/login" && endpoint !== "/api/v1/users/refresh") {
    try {
      // Attempt to refresh the token using the httpOnly cookie
      const refreshResponse = await fetch(`${API_URL}/api/v1/users/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", refreshData.access_token);
        }
        // Retry the original request with the new token
        return fetchAPI(endpoint, options, true);
      } else {
        // Refresh token is also expired or invalid
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
        }
        throw new Error("Session expired. Please log in again.");
      }
    } catch (refreshErr) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
      }
      throw refreshErr;
    }
  }


  // Handle generic errors
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    let errorMessage = "Error in backend request";
    
    if (errorData.detail) {
      if (typeof errorData.detail === 'string') {
        errorMessage = errorData.detail;
      } else if (Array.isArray(errorData.detail)) {
        errorMessage = errorData.detail[0]?.msg || JSON.stringify(errorData.detail);
      } else {
        errorMessage = JSON.stringify(errorData.detail);
      }
    }
    
    throw new Error(errorMessage);
  }

  
  // Logout (return null) 
  if (response.status === 204) {
    return null; 
  }
  
  return response.json();
}
