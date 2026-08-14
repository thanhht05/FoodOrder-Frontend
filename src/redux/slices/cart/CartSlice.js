import { createSlice } from "@reduxjs/toolkit";
import { addToCartAPI } from "../../thunk/addToCartAPI";
import { getCartAPI } from "../../thunk/getCartThunk";
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
    },


  },
  extraReducers: (builder) => {
    builder

      // add procut to cart API
      .addCase(addToCartAPI.fulfilled, (state, action) => {
        const data = action.payload;


        state.totalPrice = data.totalPrice;
        state.totalQuantity = data.totalQuantity;

        state.items = data.lst.map((item) => ({
          cartDetailId: item.cartDetailId,

          // số lượng user thêm vào cart
          quantity: item.quantity,

          // thông tin product
          id: item.productsInnerCartDetail.id,
          name: item.productsInnerCartDetail.name,
          price: item.productsInnerCartDetail.price,
          categoryName: item.productsInnerCartDetail.categoryName,
          img: item.productsInnerCartDetail.img,

          // số lượng tồn kho
          stockQuantity: item.productsInnerCartDetail.quantity,

        }));

      })
      .addCase(updateCartAPI.fulfilled, (state, action) => {
        const data = action.payload;


        state.totalPrice = data.totalPrice;
        state.totalQuantity = data.totalQuantity;

        state.items = data.lst.map((item) => ({
          cartDetailId: item.cartDetailId,

          // số lượng user thêm vào cart
          quantity: item.quantity,

          // thông tin product
          id: item.productsInnerCartDetail.id,
          name: item.productsInnerCartDetail.name,
          price: item.productsInnerCartDetail.price,
          categoryName: item.productsInnerCartDetail.categoryName,
          img: item.productsInnerCartDetail.img,

          // số lượng tồn kho
          stockQuantity: item.productsInnerCartDetail.quantity,

        }));
      })

      // get cart detail. load data from db to redux
      .addCase(getCartAPI.fulfilled, (state, action) => {
        const data = action.payload;

        state.totalPrice = data.totalPrice;
        state.totalQuantity = data.totalQuantity;

        state.items = data.lst.map((item) => ({
          cartDetailId: item.cartDetailId,

          // số lượng user thêm vào cart
          quantity: item.quantity,

          // thông tin product
          id: item.productsInnerCartDetail.id,
          name: item.productsInnerCartDetail.name,
          price: item.productsInnerCartDetail.price,
          categoryName: item.productsInnerCartDetail.categoryName,
          img: item.productsInnerCartDetail.img,

          // số lượng tồn kho
          stockQuantity: item.productsInnerCartDetail.quantity,

        }));
        state.loading = false;
      })
  },
});
export const { clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
