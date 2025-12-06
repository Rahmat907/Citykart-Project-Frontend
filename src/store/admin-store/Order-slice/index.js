import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
orderList: [],
  orderDetails: null,

}

export const getAllOrdersForAdmin = createAsyncThunk(
  "/order/getAllOrdersForAdmin",
  async () => {
    const response = await axios.get(
      `http://localhost:5000/api/admin/orders/get`
    );
    return response.data;
  }
);
export const getOrderDetailsForAdmin = createAsyncThunk(
  "/order/getOrderDetailsForAdmin",
  async (Id) => {
    const response = await axios.get(
      `http://localhost:5000/api/admin/orders/details/${Id}`
    );
    return response.data;
  }
);

const adminOrderSlice = createSlice({
    name : 'adminOrderSlice',
    initialState,
    reducers : {
        resetOrderDetails : (state)=>{
            state.orderDetails = null
        }
    },
    extraReducers : (builder)=>{
        builder.addCase(getAllOrdersForAdmin.pending, (state) => {
                state.isLoading = true;
              })
              .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderList = action.payload.data;
              })
              .addCase(getAllOrdersForAdmin.rejected, (state) => {
                state.isLoading = false;
                state.orderList = [];
              }).addCase(getOrderDetailsForAdmin.pending, (state) => {
                state.isLoading = true;
              })
              .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderDetails = action.payload.data;
              })
              .addCase(getOrderDetailsForAdmin.rejected, (state) => {
                state.isLoading = false;
                state.orderDetails = null;
              });
    }
}) 

export const {resetOrderDetails} = adminOrderSlice.reducer
export default adminOrderSlice.reducer