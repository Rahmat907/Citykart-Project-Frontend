import React, { useState } from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import CommonForm from "../common/form";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";

const initialFormData ={
    status : ""
}

const AdminOrderDetails = ({orderDetails}) => {
    const [formData,setFormData]=useState(initialFormData)
  const {user} = useSelector(state => state.auth)
    const handleUpdateStatus = (e) => {
        e.preventDefault()
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
            <p className="font-medium">Order Date</p>
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
            <Label><Badge className='py-1 px-3 bg-green-500'>
              {orderDetails?.orderStatus} 
              </Badge>
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
