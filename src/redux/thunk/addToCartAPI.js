import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosCumtome";

export const addToCartAPI = createAsyncThunk(
  "cart/addToCartAPI",
  async (item, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "/api/v1/carts",
        {
          productId: item.productId,
          quantity: item.quantity,
        },
        {
          withCredentials: true,
        },
      );
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Add to cart failed");
    }
  },
);
