import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: {
    email: "",
    phone: "",
    fullName: "",
    avatar: "",
    id: "",
    role: {
      id: "",
    },
  },
};
export const accountSlide = createSlice({
  name: "account",
  initialState,
  reducers: {
    doLoginAction: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    doGetAccountAction: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
  },
  extraReducers: () => {},
});

export const { doLoginAction, doGetAccountAction } = accountSlide.actions;
export default accountSlide.reducer;
