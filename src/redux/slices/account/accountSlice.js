import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: {
    id: "",
    email: "",
    fullname: "",
    role: {
      name: "",
    },
  },
};
const mapUser = (data) => ({
  id: data.id,
  email: data.email,
  fullName: data.fullname,
  role: {
    name: data.role?.name,
  },
});
export const accountSlide = createSlice({
  name: "account",
  initialState,
  reducers: {
    doLoginAction: (state, action) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user = mapUser(action.payload.userLogin);
    },
    doGetAccountAction: (state, action) => {
      state.isAuthenticated = true;
      state.isLoading = false;

      state.user = mapUser(action.payload.userLogin);
    },
    doSetLoadingAction: (state, action) => {
      state.isLoading = action.payload;
    },
    doLogoutAction: (state) => {
      localStorage.removeItem("access_token");
      state.isAuthenticated = false;
      state.user = {
        id: "",
        email: "",
        fullname: "",
        role: {
          name: "",
        },
      };
    },
  },
  extraReducers: () => { },
});

export const { doLoginAction, doGetAccountAction, doSetLoadingAction, doLogoutAction } =
  accountSlide.actions;
export default accountSlide.reducer;
