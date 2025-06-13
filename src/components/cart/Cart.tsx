"use client";

import { CartStore, useCartStore } from "@/store/cart-store";
import React, { useEffect, useMemo, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useShallow } from "zustand/shallow";
import { CiShoppingCart } from "react-icons/ci";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/utils/util";
import { MdOutlineDelete } from "react-icons/md";
import { createCheckoutSession } from "@/actions/stripe-actions";
import { BiLoader } from "react-icons/bi";

const Cart = () => {
  const {
    cartId,
    getTotalPrice,
    removeItem,
    updateItemQuantity,
    item,
    syncWithUser,
    setLoaded,
    isOpen,
    close,
    getTotalItems,
  } = useCartStore(
    useShallow((state: CartStore) => ({
      item: state.items,
      syncWithUser: state.syncWithUser,
      setLoaded: state.setLoaded,
      isOpen: state.isOpen,
      close: state.close,
      getTotalItems: state.getTotalItems,
      updateItemQuantity: state.updateItemQuantity,
      removeItem: state.removeItem,
      getTotalPrice: state.getTotalPrice,
      cartId: state.cartId,
    }))
  );

  const totalPrice = getTotalPrice();
  const [loadingProceed, setLoadingProceed] = useState<boolean>(false);

  const remainingForFreeShipping = useMemo(() => {
    return 15 - totalPrice;
  }, [totalPrice]);

  useEffect(() => {
    const initCart = async () => {
      await useCartStore.persist.rehydrate();
      await syncWithUser();
      setLoaded(true);
    };
    initCart();
  }, [setLoaded, syncWithUser]);

  const handleProceedToCheckout = async () => {
    if (!cartId) {
      return;
    }
    setLoadingProceed(true);
    const checkoutUrl = await createCheckoutSession(cartId);
    window.location.href = checkoutUrl;
    setLoadingProceed(false);
  };
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 bg-opacity-30 z-50 transition-opacity backdrop-blur-sm"
          onClick={close}
        />
      )}

      {/* Cart Drawer */}
      <div
        className={`fixed top-0 right-0 w-full h-full sm:w-[400px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* cart header */}

          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <div className="flex items-center gap-3 text-black">
              <CiShoppingCart className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              <span className="bg-gray-200 px-2 py-1 rounded-full text-sm font-medium">
                {getTotalItems()}
              </span>
            </div>
            <button
              onClick={close}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <IoClose className="w-6 h-6 text-black" />
            </button>
          </div>

          {/* cart items */}

          <div className="flex-1 overflow-y-auto">
            {item.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center text-black">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <CiShoppingCart className="w-8 h-8 text-gray-800" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 mb-6">
                  Looks like you have not added any items to your cart yet!
                </p>
                <Link
                  href="/"
                  onClick={close}
                  className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="divide-y">
                {item.map((item) => (
                  <div
                    key={`cart-item-${item.id}`}
                    className="flex gap-4 p-4 hover:bg-gray-100"
                  >
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border">
                      <Image
                        src={item.image || ""}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.title}
                      </h3>
                      <div className="text-sm text-gray-500 mt-1">
                        {formatPrice(item.price || 0)}
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-2">
                        <select
                          value={item.quantity}
                          onChange={(e) =>
                            updateItemQuantity(item.id, Number(e.target.value))
                          }
                          className="text-black border px-2 py-1 rounded-md focus:ring-1 focus:ring-black focus:border-transparent transition-colors"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option
                              key={`cart-qty-select-${item.id}-${num}`}
                              value={num}
                            >
                              {num}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500  text-sm hover:text-red-600 mr-5 transition-colors hover:bg-red-100 rounded-full p-2"
                        >
                          <MdOutlineDelete className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* cart footer */}
          {item.length > 0 && (
            <div className="border-t ">
              {/* shipping progress */}
              {remainingForFreeShipping > 0 ? (
                <div className="p-4 bg-blue-50 border-b">
                  <div className="flex items-center gap-2 mb-2 text-blue-800">
                    <span>🚚</span>
                    <span className="font-medium">
                      Add {formatPrice(remainingForFreeShipping)} more for FREE
                      shipping
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-200 "
                      style={{
                        width: `${Math.min(100, (totalPrice / 15) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-green-50 border-b">
                  <div className="flex items-center gap-2 text-green-800">
                    <span>✨</span>
                    <span className="font-medium">
                      Congrats! You are eligible for FREE shipping
                    </span>
                  </div>
                </div>
              )}
              {/* order summary */}
              <div className="p-4 space-y-4 text-black">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {remainingForFreeShipping > 0
                        ? "Calculated at checkout"
                        : "FREE"}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-lg">Total</span>
                    <span className="font-bold text-lg">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <button
                    className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-900 transition-colors flex items-center justify-center"
                    onClick={handleProceedToCheckout}
                    disabled={loadingProceed}
                  >
                    {loadingProceed ? (
                      <div className="flex items-center gap-1">
                        Naviagating to checkout
                        <BiLoader className="w-5 h-5 animate-spin" />
                      </div>
                    ) : (
                      "Proceed to checkout"
                    )}
                  </button>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>🔒</span>
                      <span>Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>🔁</span>
                      <span>30-day returns</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>💳</span>
                      <span>All major payment methods accepted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
