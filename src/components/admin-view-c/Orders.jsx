 import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import AdminOrderDetails from './OrderDetails'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, resetOrderDetails } from '@/store/admin-store/Order-slice'
import { restOrderDetails } from '@/store/shop/Order-slice'
import { Badge } from '../ui/badge'
 
 const AdminOrders = () => {
    const[openDetailsDialog,setopenDetailsDialog] = useState(false);
    const {orderList, orderDetails} = useSelector(state => state.adminOrder);
    const dispatch = useDispatch();

    const handleFetchOrderDetails = (getId)=>{
      dispatch(getOrderDetailsForAdmin(getId))
    }

    useEffect(()=>{
      dispatch(getAllOrdersForAdmin())
    },[dispatch])

    // console.log("The detail list" , orderDetails);
    useEffect(()=>{
      if(orderDetails !== null) setopenDetailsDialog(true)
    },[orderDetails])
    
   return (
     <Card>
      <CardHeader>
        <CardTitle>
          All Orders
        </CardTitle>
      </CardHeader>
       <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead><span className='sr-only'>Details</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          
             {orderList && orderList.length > 0
              ? orderList.map((orderItem) => (
                  <TableRow>
                    <TableCell>{orderItem?._id}</TableCell>
                    <TableCell>{orderItem?.orderData.split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge className='py-1 px-3 bg-green-500' >{orderItem?.orderStatus}</Badge>
                    </TableCell>
                    <TableCell>
                      {"\u20B9"}
                      {orderItem?.totalAmount}
                    </TableCell>
                    <TableCell>
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={()=>{
                          setopenDetailsDialog(false)
                          dispatch(resetOrderDetails())
                        }}
                      >
                        <Button
                         onClick={() => handleFetchOrderDetails(orderItem?._id)}
                         >
                          View Details
                        </Button>
                        <AdminOrderDetails orderDetails = {orderDetails} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
   )
 }
 
 export default AdminOrders
 