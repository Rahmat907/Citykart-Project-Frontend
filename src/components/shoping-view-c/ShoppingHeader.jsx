import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import logo from "../../assets/image/logo.jpg";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";

const MenuItems = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const handleNavigate = (getCurrentItem) => {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentItem.id !== "home" && getCurrentItem.id !== "products" && getCurrentItem.id !== "search"
        ? {
            category: [getCurrentItem.id],
          }
        : null;
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(new URLSearchParams(`?category=${getCurrentItem.id}`))
      : navigate(getCurrentItem.path);
  };
  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItems) => (
        <Label
          onClick={() => handleNavigate(menuItems)}
          className="text-sm font-medium cursor-pointer"
          key={menuItems.id}
        >
          {menuItems.label}{" "}
        </Label>
      ))}
    </nav>
  );
};

const HeaderRightContent = () => {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openCartSheet, setopenCartSheet] = useState(false);
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    dispatch(fetchCartItems({ userId: user?.id }));
  }, [dispatch]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4 ">
      <Sheet open={openCartSheet} onOpenChange={() => setopenCartSheet(false)}>
        <Button
          onClick={() => setopenCartSheet(true)}
          variant="outline"
          size="icon"
          className='relative'
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute top-0 right-0 text-sm font-bold">{cartItems && cartItems?.items ? cartItems?.items.length : 0}</span>
          <span className="sr-only">User Cart</span>
        </Button>
        <UserCartWrapper
          setopenCartSheet={setopenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56 ">
          <DropdownMenuLabel>Logged in as {user?.username} </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const ShoppingHeader = () => {
  // const {isAuthenticated,user} = useSelector(state=>state.auth)

  // console.log("The User is", user);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to={"/shop/home"}>
          {/* <HousePlug className='h-6 w-6' /> */}
          <img src={logo} alt="logo" className="h-9"  />
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only"> Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs pl-6">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
};

export default ShoppingHeader;
