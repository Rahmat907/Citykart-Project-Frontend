import { getAllOrdersForAdmin } from "@/store/admin-store/Order-slice";
import { fetchAllProducts } from "@/store/admin-store/Product-slice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const AdminDashboard = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
    const dispatch = useDispatch();

    useEffect(()=>{
      dispatch(getAllOrdersForAdmin()).then((data)=>{
        if(data?.payload?.success){
          // console.log(data.payload.data);
          setTotalOrders(data?.payload?.data.length);
          const amount = data?.payload?.data.reduce((acc, order) => acc + order.totalAmount, 0);
          setTotalAmount(amount);
        }
      })
    }, [dispatch])

    useEffect(()=>{
      dispatch(fetchAllProducts()).then((data)=>{
        // console.log(data);
        if(data?.payload?.success){
          setTotalProducts(data?.payload?.data.length)
        }
        
      })
    },[dispatch])
  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="p-4 border rounded-lg text-center">
          <h2 className="text-sm text-gray-600">Total Orders</h2>
          <p className="text-xl font-bold">{totalOrders}</p>
        </div>

        <div className="p-4 border rounded-lg text-center">
          <h2 className="text-sm text-gray-600">Total Users</h2>
          <p className="text-xl font-bold">35</p>
        </div>

        <div className="p-4 border rounded-lg text-center">
          <h2 className="text-sm text-gray-600">Total Products</h2>
          <p className="text-xl font-bold">{totalProducts}</p>
        </div>

        <div className="p-4 border rounded-lg text-center">
          <h2 className="text-sm text-gray-600">Revenue</h2>
          <p className="text-xl font-bold">₹{totalAmount}</p>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
