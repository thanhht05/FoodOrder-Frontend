import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosCumtome";

export const getCartAPI = createAsyncThunk("cart/getCartAPI", async () => {
  try {
    const res = await axios.get("/api/v1/cartDetails");

    // giả sử backend trả:
    // { data: { productsInnerCartDetail, quantity, totalPrice } }
    // return res.data;
    console.log(res);

    return {
      productsInnerCartDetail: res.data?.productsInnerCartDetail || [],
      quantity: res.data?.quantity || 0,
    };
  } catch (error) {
    return null;
  }
});
