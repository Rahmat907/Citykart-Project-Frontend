import React, { useEffect, useState } from "react";
import bannerOne from "./../../assets/banner/b1.webp";
import bannertwo from "./../../assets/banner/b3.webp";
import bannerthree from "./../../assets/banner/b4.webp";
import bannerfour from "./../../assets/banner/b2.webp";
import { Button } from "@/components/ui/button";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Headset,
  Image,
  LifeBuoy,
  ShirtIcon,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/product-slice";
import ShoppingProductTile from "@/components/shoping-view-c/product-tileShoping";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "sonner";
import ProductDetailsDialogue from "@/components/shoping-view-c/product-details";

const categoryWithIcon = [
    { label: "Men", id: "men", icon: ShirtIcon },
    { label: "Women", id: "women", icon: CloudLightning },
    { label: "Kids", id: "kids", icon: BabyIcon },
    { label: "Accessories", id: "accessories", icon: WatchIcon },
    { label: "Footwear", id: "footwear", icon: UmbrellaIcon },
  ];

  const brandswWithIcon= [
    { label: "Nike", id: "nike", icon : ShirtIcon },
    { label: "Adidas", id: "adidas" ,icon : WashingMachine },
    { label: "Puma", id: "puma",icon : Airplay },
    { label: "Levi's", id: "levis",icon : LifeBuoy },
    { label: "Zara", id: "zara",icon : Image },
    { label: "H&M", id: "h&m",icon : Headset },
  ]

const ShopingHome = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const {productList, productDetails} = useSelector(state => state.shopProducts)
  const [openDetailsDialog, setopenDetailsDialog] = useState(false);
  const {user} = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const slides = [bannerOne, bannertwo, bannerthree,bannerfour];
  const navigate = useNavigate()
  const handleNavigateToListingPage = (getCurrentItem, section)=>{
      sessionStorage.removeItem('filters');
      const currentFilter = {
        [section] : [getCurrentItem.id]
      }

      sessionStorage.setItem('filters', JSON.stringify(currentFilter))
      navigate('/shop/listing')
  }
    useEffect(()=>{
    const timer = setInterval(() => {
      setCurrentSlide(prevSlide=>(prevSlide + 1)% slides.length)
    }, 4000);

    return ()=> clearInterval(timer)
  },[])

  useEffect(()=>{
    dispatch(fetchAllFilteredProducts({filterParams : {} , sortParams : 'priceLowToHigh'}))
  },[dispatch])

  // console.log(productList , "Product List");
  const handleGetProductDetails = (getCurrentProductId) => {
      dispatch(fetchProductDetails(getCurrentProductId));
    };
  
    const handleAddtoCart = (getCurrentId) => {
    // console.log(getCurrentId);
    dispatch(
      addToCart({ userId: user?.id, productId: getCurrentId, quantity: 1 })
    ).then((data) => {
      if (data?.payload?.success){
        dispatch(fetchCartItems({ userId: user?.id }));
        
        toast.success("Product added to cart successfully");
      }
    });
  };

  useEffect(() => {
      if (productDetails !== null) setopenDetailsDialog(true);
    }, [productDetails]);
  return (
    <div className="flex  flex-col mi-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <img
            src={slide}
            key={index}
            className={`${index === currentSlide ? 'opacity-100' : 'opacity-0'} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 `}
          />
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick = {()=>setCurrentSlide(prevSlide=> (prevSlide - 1 + slides.length) % slides.length)}
          className="absolute top-1/2 left-4 transform  -translate-y-1/2 bg-white/80 "
        >
          <ChevronLeftIcon className="w-4 h-4 " />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick = {()=>setCurrentSlide(prevSlide=> (prevSlide + 1) % slides.length)}

          className="absolute top-1/2 right-4 transform  -translate-y-1/2 bg-white/80 "
        >
          <ChevronRightIcon className="w-4 h-4 " />
        </Button>
      </div>
      <section className="py-12 bg-gray-50 ">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 ">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 md:gird-cols-3 lg:grid-cols-5 gap-4">
            {categoryWithIcon.map((item) => (
              <Card onClick={()=> handleNavigateToListingPage(item,'category')} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className='flex flex-col items-center justify-center p-6'>
                    <item.icon className="w-12 h-12 mb-4 text-primary" />
                    <span className="font-bold">{item.label} </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50 ">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 ">
            Shop by Brand
          </h2>
          <div className="grid grid-cols-2 md:gird-cols-3 lg:grid-cols-6 gap-4">
            {brandswWithIcon.map((item) => (
              <Card onClick={()=> handleNavigateToListingPage(item,'brand')} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className='flex flex-col items-center justify-center p-6'>
                    <item.icon className="w-12 h-12 mb-4 text-primary" />
                    <span className="font-bold">{item.label} </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12">
         <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 ">
            Feature Product
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {
              productList && productList.length > 0 ? 
              productList.map(productItems=> <ShoppingProductTile 
                handleGetProductDetails={handleGetProductDetails}
                handleAddtoCart={handleAddtoCart}
                product={productItems} /> )
              :null
            }
          </div>
          </div>
      </section>
       <ProductDetailsDialogue
        open={openDetailsDialog}
        setOpen={setopenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
};

export default ShopingHome;
