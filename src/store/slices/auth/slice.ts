// src/store/slices/authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../..";
import { UserType } from "@/types/user";
import axiosInstance from "@/services/axios";
import { toast } from "sonner";

// Define the initial state using a TypeScript interface
interface AuthState {
  user: UserType | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
}

// Define the login response type
interface LoginResponse {
  user: UserType;
  token: string;
}

// Initialize the initial state
const initialState: AuthState = {
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,
};

// Async thunk for login
export const loginThunk = createAsyncThunk<
  LoginResponse,
  { mobile: string; password: string },
  { rejectValue: string }
>("auth/login/password", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/auth/login/password", {
      ...credentials,
    });
    toast.success("با موفقیت وارد شدید");
    return response.data;
  } catch (error) {
    return rejectWithValue("شماره موبایل یا رمز عبور اشتباه می باشد");
  }
});

// Async thunk for login
export const loginOtpThunk = createAsyncThunk<
  any,
  { token: string; code: string; onSubmit?: () => void },
  { rejectValue: string }
>("auth/login/mobile", async (credentials, { rejectWithValue }) => {
  const { onSubmit, ...rest } = credentials;
  try {
    const response = await axiosInstance.put("/auth/login/mobile", {
      ...rest,
    });
    if (onSubmit) onSubmit();
    toast.success("با موفقیت وارد شدید");
    return response.data;
  } catch (error) {
    return rejectWithValue("somthing went wrong");
  }
});

// Async thunk for update information
export const updateProfileThunk = createAsyncThunk<
  any,
  { name?: string; admin_name?: string; phone?: string; address?: string },
  { rejectValue: string }
>("auth/update-profile", async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/users", payload);

    toast.success("ناحیه کاربری ویرایش گردید");
    return response.data;
  } catch (error) {
    return rejectWithValue("somthing went wrong");
  }
});

// Async thunk for get user information
export const getProfileThunk = createAsyncThunk<
  any,
  undefined,
  { rejectValue: string }
>("auth/get-profile", async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/users");
    return response.data;
  } catch (error) {
    return rejectWithValue("somthing went wrong");
  }
});

// Define the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login actions
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginThunk.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.user = action.payload.user;
          state.accessToken = action.payload.token;
          state.isLoading = false;
        }
      )
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to login";
        toast.error(action.payload || "Failed to login");
      });

    builder
      .addCase(loginOtpThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginOtpThunk.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.user = action.payload.user;
          state.accessToken = action.payload.token;
          state.isLoading = false;
        }
      )
      .addCase(loginOtpThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to login";
        toast.error(action.payload || "Failed to login");
      });

    builder
      .addCase(updateProfileThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateProfileThunk.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.user = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update profile";
        toast.error(action.payload || "Failed to update profile");
      });

    builder
      .addCase(getProfileThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getProfileThunk.fulfilled,
        (state, action: PayloadAction<{ user: UserType; token: string }>) => {
          state.user = action.payload.user;
          state.isLoading = false;
        }
      )
      .addCase(getProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

// Export the actions
export const { logout } = authSlice.actions;

// Export the selector for accessing the auth state
export const selectAuth = (state: RootState) => state.auth;

// Export the reducer
export default authSlice.reducer;
