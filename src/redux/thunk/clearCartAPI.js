
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosCumtome";
export const clearCartAPI = createAsyncThunk(
    "cart/clearCartAPI",
    async ({ orderId }, { rejectWithValue }) => {
        try {
            const res = await axios.post(
                "/api/v1/clear-cart",
                {
                    orderId: orderId
                },
                {
                    withCredentials: true,
                }
            );
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Clear cart failed");
        }
    }
);