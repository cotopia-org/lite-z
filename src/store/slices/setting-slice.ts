import axiosInstance from '@/services/axios';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Async thunk for login
export const enableAfk = createAsyncThunk<
  { data: any },
  undefined,
  { rejectValue: string }
>('users/beAfk', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/users/beAfk');
    return response.data;
  } catch (error) {
    return rejectWithValue("Something wen't wrong");
  }
});

export const disableAfk = createAsyncThunk<
  { data: any },
  undefined,
  { rejectValue: string }
>('users/beOnline', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/users/beOnline');
    return response.data;
  } catch (error) {
    return rejectWithValue("Something wen't wrong");
  }
});

export type InitialStateType = {
  sounds: {
    userJoinLeft: boolean;
    messageIncoming: boolean;
  };
  afk: boolean;
};

const initialState: InitialStateType = {
  sounds: {
    userJoinLeft: true,
    messageIncoming: true,
  },
  afk: false,
};

const settingSlice = createSlice({
  name: 'setting-slice',
  initialState: initialState,
  reducers: {
    toggleSoundSetting: (
      state,
      action: PayloadAction<{ key: keyof InitialStateType['sounds'] }>,
    ) => {
      state.sounds[action.payload.key] = !state.sounds[action.payload.key];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(enableAfk.pending, (state) => {
        state.afk = false;
      })
      .addCase(enableAfk.fulfilled, (state) => {
        state.afk = true;
      });
    builder
      .addCase(disableAfk.pending, (state) => {
        state.afk = true;
      })
      .addCase(disableAfk.fulfilled, (state) => {
        state.afk = false;
      });
  },
});

export const { toggleSoundSetting: toggleSoundSettingAction } =
  settingSlice.actions;

export default settingSlice.reducer;
