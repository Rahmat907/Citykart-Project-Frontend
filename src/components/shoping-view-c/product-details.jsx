import React, { useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { StarIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { setProductDetails } from "@/store/shop/product-slice";
import { Textarea } from "../ui/textarea";

const ProductDetailsDialogue = ({ open, setOpen, productDetails }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddtoCart = (getCurrentId) => {
    dispatch(
      addToCart({ userId: user?.id, productId: getCurrentId, quantity: 1 })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems({ userId: user?.id }));
        toast.success("Product added to cart successfully");
      }
    });
  };

  const handleAskAI = async () => {
    if (!aiQuestion.trim()) return toast.error("Please type your question");

    try {
      setLoading(true);
      setAiAnswer("");

      const { data } = await axios.post(
        "http://localhost:5000/api/shop/ai/askai",
        {
          productId: productDetails?._id,
          question: aiQuestion,
        }
      );

      setAiAnswer(data.reply);
      setAiQuestion("");
    } catch (err) {
      console.log(err);
      toast.error("AI could not answer now. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setOpen(false);
    setAiAnswer("");
    setAiQuestion("");
    dispatch(setProductDetails());
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[80vw] lg:max-w-[70vw]">
        
        {/* IMAGE */}
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover "
          />
        </div>

        {/* RIGHT SIDE CONTENT */}
        <div>
          <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
          <p className="text-muted-foreground text-2xl mb-5 mt-4 ">
            {productDetails?.description}
          </p>

          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold text-primary">
              ₹ {productDetails?.price}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-3">
  <div className="flex items-center gap-0.5">
    <StarIcon className="w-5 h-5 fill-primary" />
    <StarIcon className="w-5 h-5 fill-primary" />
    <StarIcon className="w-5 h-5 fill-primary" />
    <StarIcon className="w-5 h-5 fill-primary" />
    <StarIcon className="w-5 h-5 fill-primary" />
  </div>
  <span className="text-muted-foreground">(4.5)</span>
</div>

          <Button
            disabled={productDetails?.totalStock === 0}
            className="w-full mt-4 mb-4"
            onClick={() => handleAddtoCart(productDetails?._id)}
          >
            Add to Cart
          </Button>

          <Separator />

          
          <div className="mt-5">
            <h2 className="text-xl font-bold mb-3">Ask with AI</h2>

            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Ask about this product..."
                  className="h-15"
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                />
                <Button onClick={handleAskAI} disabled={loading}>
                  {loading ? "Thinking..." : "Send"}
                </Button>
              </div>

              {aiAnswer && (
                <div className="p-3 rounded-lg border bg-muted text-sm whitespace-pre-line">
                  <p className="font-medium mb-1">AI Reply:</p>
                  <p>{aiAnswer}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialogue;
