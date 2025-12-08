import React, { useEffect, useState } from "react";
import imagess from "../../assets/image/aimg.webp";
import Address from "@/components/shoping-view-c/address";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shoping-view-c/cart-items-content";
import { Button } from "@/components/ui/button";
import { createNewOrder } from "@/store/shop/Order-slice";
import { toast } from "sonner";
const ShopingCheckout = () => {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setcurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setisPaymentStart] = useState(false);
  const dispatch = useDispatch();
  // console.log("addres info", currentSelectedAddress);
  // console.log(cartItems);
  const totalCartAmount =
    cartItems && cartItems?.items && cartItems?.items?.length > 0
      ? cartItems?.items.reduce((sum, currentItem) => {
          return (
            sum +
            (currentItem.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity
          );
        }, 0)
      : 0;

  const handleInitiatePaypalPayment = () => {
    if (cartItems.items.length === 0) {
      toast.warning("Your Cart is Empty. Please add items to proceed");
      return;
    }

    if (currentSelectedAddress === null) {
      toast.warning("Please select one address to proceed");
      return;
    }
    const orderData = {
      userId: user?.id,
      username: user?.username,
      cartId: cartItems?._id,
      cartItems: cartItems?.items.map((singlecartitem) => ({
        productId: singlecartitem?.productId,
        title: singlecartitem?.title,
        image: singlecartitem?.image,
        price:
          singlecartitem?.salePrice > 0
            ? singlecartitem?.salePrice
            : singlecartitem?.price,
        quantity: singlecartitem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderData: new Date(),
      orderUpdateData: new Date(),
      paymentId: "",
      payerId: "",
    };
    // console.log(orderData);
    dispatch(createNewOrder(orderData)).then((data) => {
      // console.log('success hua', data);
      if (data?.payload?.success) {
        setisPaymentStart(true);
      } else {
        setisPaymentStart(false);
      }
    });
  };

  useEffect(() => {
    if (approvalURL) {
      window.location.href = approvalURL;
    }
  }, [approvalURL]);

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={imagess}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address selectId={currentSelectedAddress} setcurrentSelectedAddress={setcurrentSelectedAddress} />
        <div className="flex flex-col gap-4 ">
          {cartItems && cartItems.items && cartItems?.items?.length > 0
            ? cartItems?.items.map((item) => (
                <UserCartItemsContent cartItems={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between ">
              <span className="font-bold">Total</span>
              <span className="font-bold">{"\u20B9"} {totalCartAmount} </span>
            </div>
          </div>
          <div className="mt-4 w-full ">
            <Button onClick={handleInitiatePaypalPayment} className="w-full">
              {
                isPaymentStart ? "Processing Paypal Payment..." : "Checkout with Paypal"
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopingCheckout;
