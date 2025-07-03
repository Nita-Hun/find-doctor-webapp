import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:8080",
});

// Attach token automatically
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    // Ensure it's non-empty and not literal "undefined"
    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

