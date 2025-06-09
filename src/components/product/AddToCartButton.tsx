"use client";
import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { CartStore, useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/utils/util";
import React, { useState } from "react";
import { IoCartOutline } from "react-icons/io5";
import { VscLoading } from "react-icons/vsc";
import { useShallow } from "zustand/shallow";

type AddToCartButtonProps = {
  product: Product;
};

const AddToCartButton = ({ product }: AddToCartButtonProps) => {
  const { addItem, open } = useCartStore(
    useShallow((state: CartStore) => ({
      addItem: state.addItem,
      open: state.open,
    }))
  );

  const [isLoading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!product.title || product.price == undefined || !product.image) return;

    setLoading(true);

    // add the item to the cart logic
    await new Promise((resolve) => setTimeout(resolve, 600));

    addItem({
      id: product._id,
      title: product?.title,
      price: product?.price,
      image: urlFor(product.image).url(),
      quantity: 1,
    });

    setLoading(false);
    open();
  };

  if (!product.price) return null;

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading}
      className={`w-full mt-6 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 py-2 rounded-full text-white font-bold text-xl hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-[1.02] active:scale-[1.02] shadow-xl flex items-center justify-center gap-3 disabled:opacity-80 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100 disabled:hover:from-red-500 disabled:hover:to-red-600`}
    >
      {isLoading ? (
        <>
          <VscLoading className="w-6 h-6 animate-spin" />
          <span>Adding to Cart...</span>
        </>
      ) : (
        <>
          <IoCartOutline className="w-6 h-6" />
          Add to Cart - {formatPrice(product.price)}
        </>
      )}
    </button>
  );
};

export default AddToCartButton;
