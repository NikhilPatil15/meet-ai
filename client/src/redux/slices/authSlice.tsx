// redux/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, AppDispatch } from '../store';
import axios from 'axios';
import { AnyARecord } from 'dns';

interface AuthState {
  user: any;
  loading: boolean;
  error: string | null;
}


const initialState: AuthState = {
  user: null,
  loading: true, 
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction) => {
      state.user = action.payload;
      state.loading = false;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
    },
  },
});

export const { setUser, setError, setLoading, clearUser } = authSlice.actions;

// Thunk action for fetching the user
export const fetchUser = (): AppThunk => async (dispatch: AppDispatch | any) => {
  dispatch(setLoading());
<<<<<<< HEAD
  // try {
  //   axios.defaults.withCredentials = true
  //   const response = await axios.get('http://localhost:5000/api/v1/user/get-user');
  //   dispatch(setUser(response.data.data.FetchedUser));
  // } catch (error:any) {
  //   if (error.response?.status === 401) {
  //     try {
  //       await axios.post('/api/refresh-tokens');
  //       dispatch(fetchUser());  // Retry fetching the user after refreshing tokens
  //     } catch (refreshError) {
  //       dispatch(clearUser());
  //     }
  //   } else {
  //     dispatch(setError(error.message));
  //   }
  // }
=======
  try {
    axios.defaults.withCredentials = true
    const response = await axios.get('http://localhost:5000/api/v1/user/get-user');
    dispatch(setUser(response.data.data.FetchedUser));
  } catch (error:any) {
    if (error.response?.status === 401) {
      try {
        await axios.post('http://localhost:5000/api/v1/user/refresh-tokens');
        dispatch(fetchUser());  // Retry fetching the user after refreshing tokens
      } catch (refreshError) {
        dispatch(clearUser());
      }
    } else {
      dispatch(setError(error.message));
    }
  }
>>>>>>> 9e989f44a3f1eb3212549e576795bfee5a701965
};

export default authSlice.reducer;
