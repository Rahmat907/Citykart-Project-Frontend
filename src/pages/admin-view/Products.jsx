import ProductImageUpload from "@/components/admin-view-c/image-upload";
import AdminProductTile from "@/components/admin-view-c/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductElement } from "@/config";
import {
  addNewProducts,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin-store/Product-slice";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const initialFormData = {
  images: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

const AdminProduct = () => {
  const [openCreateProductDialog, setopenCreateProductDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setimageFile] = useState(null);
  const [uploadedImage, setuploadedImage] = useState("");
  const [imageLoadingState, setimageLoadingState] = useState(false);
  const [currentEditedId, setcurrentEditedId] = useState(null);
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.adminProducts);
  const onSubmit = (event) => {
    event.preventDefault();
    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData,
          })
        ).then((data) => {
          // console.log(data,"message");
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setopenCreateProductDialog(false);
            setcurrentEditedId(null);
          }
        })
      : dispatch(
          addNewProducts({
            ...formData,
            image: uploadedImage,
          })
        ).then((data) => {
          // console.log(data);
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setimageFile(null);
            setFormData(initialFormData);
            toast.success("Product Added Successfully");
            setopenCreateProductDialog(false);
          }
        });
  };
  // console.log(formData);
  const handledelete = (getCurrentId) => {
    dispatch(deleteProduct(getCurrentId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  };

  const isFormValid = () => {
    return Object.keys(formData)
      .map((key) => formData[key] !== "")
      .every((item) => item);
  };
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // console.log(
  //   "This is productlis",
  //   productList,
  //   "This is image URl",
  //   uploadedImage
  // );

  return (
    <Fragment>
      <div className="mb-5 flex w-full justify-end">
        <Button onClick={() => setopenCreateProductDialog(true)}>
          Add new Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((product) => (
              <AdminProductTile
                product={product}
                setcurrentEditedId={setcurrentEditedId}
                setopenCreateProductDialog={setopenCreateProductDialog}
                setFormData={setFormData}
                handledelete={handledelete}
              />
            ))
          : null}
      </div>

      <Sheet
        open={openCreateProductDialog}
        onOpenChange={() => {
          setopenCreateProductDialog(false);
          setcurrentEditedId(null);
          setFormData(initialFormData);
          // console.log("After close yeah chala ke nhi");
        }}
      >
        <SheetContent
          side="right"
          className="overflow-auto"
          aria-describedby=""
        >
          <SheetHeader>
            <SheetTitle className="text-lg">
              {" "}
              {currentEditedId !== null
                ? "Edit Product"
                : "Add New Product"}{" "}
            </SheetTitle>
            <ProductImageUpload
              file={imageFile}
              setFile={setimageFile}
              uploadedImageUrl={uploadedImage}
              setUploadedImageUrl={setuploadedImage}
              setimageLoadingState={setimageLoadingState}
              imageLoadingState={imageLoadingState}
              isEditmode={currentEditedId !== null}
            />
            <div className="py-6">
              <CommonForm
                formData={formData}
                setFormatData={setFormData}
                onSubmit={onSubmit}
                formControls={addProductElement}
                buttonText={currentEditedId !== null ? "Edit" : "Add"}
                isButtonDisabel={!isFormValid()}
              />
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
};

export default AdminProduct;
