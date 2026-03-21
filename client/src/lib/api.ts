import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : "http://localhost:5000/api",
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await axios.post(
          process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh` : "http://localhost:5000/api/auth/refresh",
          {},
          { withCredentials: true }
        );
        return api(error.config);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
