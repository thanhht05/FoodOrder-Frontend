import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  carts: [], // thông tin cart
};
export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    doAddProductAction: (state, action) => {
      let carts = state.carts;
      const item = action.payload;
      let isExistIndex = carts.findIndex((c) => c.productId === item.productId);
      if (isExistIndex > -1) {
        carts[isExistIndex].quantity =
          carts[isExistIndex].quantity + item.quantity;
      } else {
        state.carts.push(item);
      }
      //update redux
      state.carts = carts;
    },
  },
});
export const { doAddProductAction } = orderSlice.actions;
export default orderSlice.reducer;
