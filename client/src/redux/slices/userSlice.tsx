import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  userInfo: any;
  auth: boolean;
}

const initialState: UserState = {
  userInfo: null,
  auth: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState["userInfo"]>) => {
      (state.userInfo = action.payload), (state.auth = true);
    },
    clearUser: (state) => {
      (state.userInfo = null), (state.auth = false);
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
