import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosCumtome";

export const updateCartAPI = createAsyncThunk(
  "cart/upate",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        "/api/v1/cartDetails",
        {
          productId,
          quantity,
        },
        {
          withCredentials: true,
        },
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "update to cart failed");
    }
  },
);
