import React from "react";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import UserCartItemsContent from "./cart-items-content";
import { Navigate, useNavigate } from "react-router-dom";

const UserCartWrapper = ({ cartItems , setopenCartSheet}) => {
  const navigate = useNavigate()
  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce((sum, currentItem) => {
          return (
            sum +
            (currentItem.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity
          );
        }, 0)
      : 0;
  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>

        <div className="mt-8 space-y-4">
          {cartItems && cartItems.length > 0
            ? cartItems.map((item) => <UserCartItemsContent cartItems={item} />)
            : null}
        </div>
        <div className="mt-8 space-y-4">
          <div className="flex justify-between ">
            <span className="font-bold">Total</span>
            <span className="font-bold">${totalCartAmount} </span>
          </div>
        </div>
        <Button onClick={()=> {
          navigate('/shop/checkout')
          setopenCartSheet(false)
        }

        } className="w-full mt-6">CheckOut</Button>
      </SheetHeader>
    </SheetContent>
  );
};

export default UserCartWrapper;
