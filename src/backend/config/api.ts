import axios from "axios";

/* ============================
   AXIOS INSTANCE
============================ */

export const API = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

/* ============================
   RESPONSE TYPES (optional future use)
============================ */

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
}

/* ============================
   INTERCEPTORS (optional but useful)
============================ */

// Response interceptor (error handling)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // you can customize global error handling here
    return Promise.reject(error);
  }
);