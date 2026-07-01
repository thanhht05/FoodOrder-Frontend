import { createSlice } from "@reduxjs/toolkit";
import { mergeCart } from "../../thunk/cartThunk";
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

    // when user place an order
    clearCart: (state) => {
      state.items = [];
      state.isGuestCart = true;
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;

      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
    removeItem: (state, action) => {
      const id = action.payload.id;
      state.items = state.items.filter((item) => item.id !== id);
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(mergeCart.fulfilled, (state, action) => {
        const data = action.payload.data;
        state.items = data.productsInnerCartDetail || [];
        state.isMerged = true;
      })
      .addCase(mergeCart.rejected, (state) => {
        state.items = [];
        state.isGuestCart = true;
      })

      // add procut to cart API when user have already login
      .addCase(addToCartAPI.fulfilled, (state, action) => {
        const data = action.payload.data;

        state.items = data.productsInnerCartDetail || [];
        console.log(
          "data.productsInnerCartDetail",
          data.productsInnerCartDetail,
        );
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
export const { addToCart, setCart, clearCart, updateQuantity, removeItem } =
  cartSlice.actions;
export default cartSlice.reducer;
