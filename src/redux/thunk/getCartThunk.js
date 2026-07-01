import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosCumtome";

export const getCartAPI = createAsyncThunk("cart/getCartAPI", async () => {
  try {
    const res = await axios.get("/api/v1/cartDetailUser");
    debugger;
    const rs = {
      results:
        res.data?.map((item) => ({
          cartDetailId: item.cartDetailId,
          quantity: item.quantity,
          id: item.productsInnerCartDetail.id,
          name: item.productsInnerCartDetail.name,
          price: item.productsInnerCartDetail.price,
          categoryName: item.productsInnerCartDetail.categoryName,
          img: item.productsInnerCartDetail.img,
        })) || [],

      totalQuantity:
        res.data?.reduce((sum, item) => sum + item.quantity, 0) || 0,
    };
    return rs;
  } catch (error) {
    return null;
  }
});
