import { createSlice } from "@reduxjs/toolkit";
import { mergeCart } from "../../thunk/cartThunk";
import { addToCartAPI } from "../../thunk/addToCartAPI";
import { getCartAPI } from "../../thunk/getCartThunk";

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  isMerged: false,
};
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // add to cart when user do not login
    addToCart: (state, action) => {
      const item = action.payload;

      const existing = state.items.find((c) => c.productId === item.productId);

      if (existing) {
        existing.quantity += item.quantity; // update quantity of existing product
      } else {
        state.items.push(item); // add new product into items
      }
    },

    // setCart: (state, action) => {
    //   state.items = action.payload;
    // },

    // when user logout
    clearCart: (state) => {
      state.items = [];
      state.isMerged = false;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(mergeCart.fulfilled, (state, action) => {
        const data = action.payload.data;

        state.items = data.productsInnerCartDetail || [];
        state.totalQuantity = data.quantity || 0;
        state.totalPrice = data.totalPrice || 0;

        state.isMerged = true;
      })

      // add procut to cart API when user have already login
      .addCase(addToCartAPI.fulfilled, (state, action) => {
        const data = action.payload.data;

        state.items = data.productsInnerCartDetail || [];
        state.totalQuantity = data.quantity || 0;
        state.totalPrice = data.totalPrice || 0;
      })

      // get cart detail. load data from db to redux
      .addCase(getCartAPI.fulfilled, (state, action) => {
        const data = action.payload;
        console.log("Data get cart detail", data.productsInnerCartDetail);

        state.items = data.productsInnerCartDetail || [];
        state.totalQuantity = data.quantity || 0;
        state.totalPrice = data.totalPrice || 0;

        state.loading = false;
      });
  },
});
export const { addToCart, setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
