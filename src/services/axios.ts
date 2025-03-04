import {VARZ} from "@/const/varz";
import store from "@/store";
import axios, {AxiosInstance, AxiosResponse} from "axios";
import {toast} from "sonner";

export type FetchDataType<T> = {
    meta: {
        code: number;
        message: string;
    };
    status: string;
    data: T;
};

// Create a new Axios instance
const axiosInstance: AxiosInstance = axios.create({
    baseURL: VARZ.apiBaseUrl,
});

// Add a request interceptor to add authorization headers
axiosInstance.interceptors.request.use(
    (config: any) => {
        if (typeof window === "undefined") return config;

        const accessToken = store.getState().auth.accessToken;
        if (accessToken && config?.headers) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        const socketId = localStorage.getItem("socket-id");

        if (socketId) config.headers["socket-id"] = socketId;
        return config;
    },
    (error) => {
        toast.success(error.data.message)

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
            // originalRequest._retry = true;
            // // Perform token refresh logic here
            // try {
            //   const newAccessToken = await refreshAccessToken(); // Implement your refresh token logic
            //   if (newAccessToken) {
            //     // Retry the original request with the new access token
            //     originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            //     return axiosInstance(originalRequest);
            //   }
            // } catch (refreshError) {
            //   //Signing out the user here
            //   //TODO - Add logic here
            // }

            //Means we are in client mode
            if (typeof window !== "undefined") {
                // toast.loading("You are going to logout!");
                // window.location.href = __VARS.signOutApiPage;
            }
        }

        const errorData = error.response.data;

        if (
            typeof window !== "undefined" &&
            errorData?.["meta"] &&
            typeof errorData["meta"]?.["message"] === "string"
        ) {
            //Means we have error string as detail
            toast.error(errorData?.meta?.message);
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
