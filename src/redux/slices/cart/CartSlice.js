import { createSlice } from "@reduxjs/toolkit";
import { addToCartAPI } from "../../thunk/addToCartAPI";
import { getCartAPI } from "../../thunk/getCartThunk";
import { IdcardFilled } from "@ant-design/icons";
import { updateCartAPI } from "../../thunk/updateCartAPI";

const initialState = {
  items: [],
  loading: false,
};
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    clearCart: (state) => {
      state.items = [];
      state.isGuestCart = true;
    },


  },
  extraReducers: (builder) => {
    builder

      // add procut to cart API
      .addCase(addToCartAPI.fulfilled, (state, action) => {
        const data = action.payload.data;
        state.items = data.productsInnerCartDetail || [];

      })
      .addCase(updateCartAPI.fulfilled, (state, action) => {
        state.items = action.payload.data.productsInnerCartDetail || [];
      })

      // get cart detail. load data from db to redux
      .addCase(getCartAPI.fulfilled, (state, action) => {
        const data = action.payload;

        state.items =
          data?.results?.map((item) => ({
            cartDetailId: item.cartDetailId,
            id: item.id,
            name: item.name,
            price: item.price,
            categoryName: item.categoryName,
            img: item.img,
            quantity: item.quantity,
          })) || [];

        state.loading = false;
      });
  },
});
export const { clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
