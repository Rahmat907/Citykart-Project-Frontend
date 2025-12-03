import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import CommonForm from "../common/form";
import { addressForm } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { addNewAddress, deleteAddress, editAddress, fetchAllAddress } from "@/store/shop/Address-slice";
import AddressCart from "./addressCart";
import { toast } from "sonner";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

const Address = () => {
    const [formData, setFormData] = useState(initialAddressFormData);
    const [currentEditedId,setcurrentEditedId] = useState(null)
    const disptach = useDispatch()
    const {user} = useSelector(state => state.auth)
    const {addressList} = useSelector(state => state.shopAddress)

    // console.log("Addres list", addressList);
    
    
    const handleMangeAddress = (e) => {
      e.preventDefault();
      if(addressList.length >= 3 && currentEditedId === null){
        setFormData(initialAddressFormData)
        toast.warning("You Can Add max 3 Addresses")
        return; 
      }

  if (currentEditedId !== null) {
    // EDIT MODE
    disptach(editAddress({
      userId: user?.id,
      addressId: currentEditedId,
      formData
    })).then(data => {
      if (data?.payload?.success) {
        disptach(fetchAllAddress(user?.id));
        setcurrentEditedId(null);
        setFormData(initialAddressFormData);
        toast.success("Address Updated Successfully")
      }
    });
  } else {
    // ADD MODE
    disptach(addNewAddress({
      ...formData,
      userId: user?.id,
    })).then(data => {
      if (data?.payload?.success) {
        disptach(fetchAllAddress(user?.id));
        setFormData(initialAddressFormData);
        toast.success("Address Added Successfully")

      }
    });
  }
};


    const handleDelteAddress = (getCurrentAddress)=>{
        disptach(deleteAddress({userId : user?.id, addressId: getCurrentAddress._id})).then(data=>{
            if(data?.payload?.success){
                disptach(fetchAllAddress(user?.id))
                toast.success("Address Deleted Successfully")

            }
        })
        
    }

    const handleEditAddress = (getCurrentAddress)=>{
        // console.log("Button click hua");
        
        setcurrentEditedId(getCurrentAddress?._id)
        setFormData({
            ...formData,
            address: getCurrentAddress?.address,
            city: getCurrentAddress?.city,
            phone: getCurrentAddress?.phone,
            pincode: getCurrentAddress?.pincode,
            notes: getCurrentAddress?.notes,
        })
    }
 const isFormValid = () => {
  return Object.keys(formData)
    .map((key) => formData[key].trim() !== "")
    .every((item) => item);
};

    useEffect(()=>{
        disptach(fetchAllAddress(user?.id))
    },[disptach])


  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {
            addressList && addressList.length > 0 ? addressList.map(singleAddressItems => <AddressCart 
            addressInfo={singleAddressItems}
            handleDelteAddress={handleDelteAddress}
            handleEditAddress={handleEditAddress}
            />) : null
        }
      </div>
      <CardHeader>
        <CardTitle>{ currentEditedId !== null ? 'Edit Address' : 'Add new Address'} </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <CommonForm
          formControls={addressForm}
          formData={formData}
          setFormatData={setFormData}
          buttonText={ currentEditedId !== null ? 'Edit' : 'Add'}
          onSubmit={handleMangeAddress}
          isButtonDisabel={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
};

export default Address;
