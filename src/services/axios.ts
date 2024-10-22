import { VARZ } from "@/const/varz";
import store from "@/store";
import { logout } from "@/store/slices/auth/slice";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { toast } from "sonner";

export type FetchDataType<T> = T;

export type FetchPaginatedDataType<T> = {
  items: T[];
  _meta: {
    currentPage: number;
    pageCount: number;
    perPage: number;
    totalCount: number;
  };
  _links: {
    first: { href: string };
    last: { href: string };
    self: { href: string };
  };
};

// Create a new Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: VARZ.apiBaseUrl,
  headers: {
    "x-key": VARZ.xKey,
    "accept-language": "fa",
  },
});

// Add a request interceptor to add authorization headers
axiosInstance.interceptors.request.use(
  (config: any) => {
    if (typeof window === "undefined") return config;

    const state = store.getState();
    const token = state.auth.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to refresh access token if needed
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error response status is 401 and the request was not already retried
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      typeof window !== "undefined"
    ) {
      store.dispatch(logout());
    }

    const errorData = error.response.data;

    if (typeof window === "undefined") return Promise.reject(error);

    if (Array.isArray(errorData) && errorData?.length > 0) {
      for (let errorItem of errorData) {
        if (errorItem?.message) toast.error(errorItem?.message);
      }
    } else {
      if (
        errorData?.["meta"] &&
        typeof errorData["meta"]?.["message"] === "string"
      ) {
        //Means we have error string as detail
        toast.error(errorData?.meta?.message);
      }
    }

    return Promise.reject(error);
  }
);

// Function to refresh access token
async function refreshAccessToken(): Promise<string | null> {
  // console.log("axios", axiosInstance.defaults.headers.common["Authorization"]);

  // const accessToken = localStorage.getItem("accessToken");

  // const response = await axiosInstance.get("/users/token");
  // return response.data.accessToken;
  return null; // Placeholder, replace with actual implementation
}

export default axiosInstance;
