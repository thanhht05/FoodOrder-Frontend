import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosCumtome";

export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const items = state.cart.items;

      // 🔥 không gọi nếu cart rỗng
      if (!items || items.length === 0) {
        return { items: [] };
      }

      const res = await axios.post(
        "api/v1/cartMerge",
        { items }, // đúng format
        {
          withCredentials: true, // nếu dùng cookie
        },
      );
      console.log("res form merge cart", res);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Merge failed");
    }
  },
);
