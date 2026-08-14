import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosCumtome";

export const getCartAPI = createAsyncThunk("cart/getCartAPI", async () => {
  try {
    const res = await axios.get("/api/v1/cartDetailUser");
    return res.data;
  } catch (error) {
    return null;
  }
});
