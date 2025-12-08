import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import ShopingOrderDetails from "./ShopingOrderDetails";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrderbyUserId,
  getOrderDetails,
  restOrderDetails,
} from "@/store/shop/Order-slice";
import { Badge } from "../ui/badge";

const ShoppingOrders = () => {
  const [openDetailsDialog, setopenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  const handleFetchOrderDetails = (getId) => {
    dispatch(getOrderDetails(getId));
  };

  useEffect(() => {
    dispatch(getAllOrderbyUserId(user?.id));
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setopenDetailsDialog(true);
  }, [orderDetails]);
  // console.log("order List", orderDetails);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((orderItem) => (
                  <TableRow>
                    <TableCell>{orderItem?._id}</TableCell>
                    <TableCell>{orderItem?.orderData.split("T")[0]}</TableCell>
                    <TableCell>
                      {orderItem?.orderStatus === "confirmed" ? (
                        <Badge className="bg-green-500">Confirmed</Badge>
                      ) : orderItem?.orderStatus === "pending" ? (
                        <Badge className="bg-black">Pending</Badge>
                      ) : orderItem?.orderStatus === "inprogress" ? (
                        <Badge className="bg-blue-500">In Progress</Badge>
                      ) : orderItem?.orderStatus === "inshipping" ? (
                        <Badge className="bg-gray-500">In Shipping</Badge>
                      ) : orderItem?.orderStatus === "delivered" ? (
                        <Badge className="bg-green-500">Delivered</Badge>
                      ) : (
                        <Badge variant="destructive">Rejected</Badge>
                      )}{" "}
                    </TableCell>
                    <TableCell>
                      {"\u20B9"}
                      {orderItem?.totalAmount}
                    </TableCell>
                    <TableCell>
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {
                          setopenDetailsDialog(false);
                          dispatch(restOrderDetails());
                        }}
                      >
                        <Button
                          onClick={() =>
                            handleFetchOrderDetails(orderItem?._id)
                          }
                        >
                          View Details
                        </Button>
                        <ShopingOrderDetails orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ShoppingOrders;
