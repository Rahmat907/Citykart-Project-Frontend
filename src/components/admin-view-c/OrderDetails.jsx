import React, { useState } from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import CommonForm from "../common/form";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, updateOrderDetailsForAdmin } from "@/store/admin-store/Order-slice";

const initialFormData ={
    status : ""
}

const AdminOrderDetails = ({orderDetails}) => {
    const [formData,setFormData]=useState(initialFormData)
  const {user} = useSelector(state => state.auth)
  const dispatch = useDispatch();


    const handleUpdateStatus = (e) => {
        e.preventDefault()
        // console.log("the formdata", formData);
        const {status} = formData;   
        // console.log("This id is", orderDetails?._id);
           
      dispatch(updateOrderDetailsForAdmin({id : orderDetails?._id, orderStatus : status})).then(data =>{
      if(data?.payload?.success){
        dispatch(getOrderDetailsForAdmin(orderDetails?._id))
        dispatch(getAllOrdersForAdmin())
        setFormData(initialFormData)
      }
        
      })
    }
  return (
    <DialogContent className= 'sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
      <div className="grid  gap-6 ">
          <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Datee</p>
           <Label>{orderDetails?.orderData.split("T")[0]}</Label>

          </div>
          
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>{"\u20B9"}{orderDetails?.totalAmount} </Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Method</p>
            <Label>{orderDetails?.paymentMethod} </Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails?.paymentStatus} </Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>{
              orderDetails?.orderStatus === 'confirmed' ? <Badge  className='bg-green-500' >Confirmed</Badge> :
              orderDetails?.orderStatus === 'pending' ? <Badge className='bg-black'>Pending</Badge> :
              orderDetails?.orderStatus === 'inprogress' ? <Badge className='bg-blue-500' >In Progress</Badge> :
              orderDetails?.orderStatus === 'inshipping' ? <Badge className='bg-gray-500'>In Shipping</Badge> :
              orderDetails?.orderStatus === 'delivered' ? <Badge className='bg-green-500' >Delivered</Badge> :
              <Badge variant="destructive">Rejected</Badge>
            }
              </Label>
          </div>
        </div>
        <Separator />
           <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {
                orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ? 
                orderDetails.cartItems.map(item => <li className="flex items-center justify-between">
                <span>{item.title}</span>
                <span>Quantity: {item.quantity} </span>
                <span>Price: {"\u20B9"}{item.price}</span>
              </li> )
                : null
              }
              
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user.username} </span>
              <span>{orderDetails?.addressInfo?.address} </span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>
        <div>
          <CommonForm
            formControls={[
              {
                  name: "status",
                  label: "Order Status",
                componentType: "select",
                options: [
                    { label: "Pending", id: "pending" },
                  { label: "In Progress", id: "inprogress" },
                  { label: "In Shipping", id: "inshipping" },
                  { label: "Delivered", id: "delivered" },
                  { label: "Rejected", id: "rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormatData={setFormData}
            buttonText={'Update Order Status'}
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
};

export default AdminOrderDetails;
