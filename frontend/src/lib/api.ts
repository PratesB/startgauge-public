// Backend URL FastAPI
const API_URL = "http://localhost:8000";

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string | null) => void; reject: (err: any) => void }> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
    
    if (isRefreshing) {
      // If a refresh is already in progress, put this request in a queue to wait
      return new Promise<string | null>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
      .then((newToken) => {
        // Once the queue is processed with a new token, retry this request
        return fetchAPI(endpoint, options, true);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
    }

    isRefreshing = true;

    try {
      // Attempt to refresh the token using the httpOnly cookie
      const refreshResponse = await fetch(`${API_URL}/api/v1/users/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        const newToken = refreshData.access_token;
        
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", newToken);
        }
        
        isRefreshing = false;
        processQueue(null, newToken);
        
        // Retry the original request with the new token
        return fetchAPI(endpoint, options, true);
      } else {
        // Refresh token is also expired or invalid
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
        }
        
        const error = new Error("Session expired. Please log in again.");
        isRefreshing = false;
        processQueue(error, null);
        
        // Force redirect to login page for a clean UX
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        
        throw error;
      }
    } catch (refreshErr) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
      }
      
      isRefreshing = false;
      processQueue(refreshErr as Error, null);
      
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
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
