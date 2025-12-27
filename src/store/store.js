import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import AdminProductSlice from "./admin-store/Product-slice/index.js";
import adminOrderSlice from "./admin-store/Order-slice/index.js";
import shopingProductSlice from "./shop/product-slice/index.js";
import shopingCartSlice from "./shop/cart-slice/index.js";
import shopingAddressSlice from "./shop/Address-slice/index.js";
import shopingOrderSlice from "./shop/Order-slice/index.js";
import shopingSearchSlice from "./shop/search-slice/index.js";
// redux store = global store ka container
const store = configureStore({ // yeah ek function jo redux store ko create yeah setup karta hai with reducer,middleware, and devtools in an clean and optimized way. 
  reducer: {  // reducer is pure function that takes the current state and an action, and return  a new updated state based on that action. 
    auth: authReducer,
    adminProducts: AdminProductSlice,
    adminOrder: adminOrderSlice,
    shopProducts: shopingProductSlice,
    shopCart: shopingCartSlice,
    shopAddress: shopingAddressSlice,
    shopOrder: shopingOrderSlice,
    shopSearch: shopingSearchSlice,
  },
});

export default store;
