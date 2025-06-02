import SalesCampaignBanner from "@/components/layout/SalesCampaignBanner";
import { getProductById } from "@/sanity/lib/client";
import { CiHome } from "react-icons/ci";
import Link from "next/link";
import React from "react";
import { BiChevronRight } from "react-icons/bi";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { formatPrice } from "@/utils/util";

const ProductPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product.price) {
    return <div>Product not found</div>;
  }

  const originalPrice = product.price * 5;
  return (
    <div className="bg-gray-50">
      <SalesCampaignBanner />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto py-3 px-4">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href={"/"}
              className="text-gray-400 hover:text-red-600 transition-colors duration-300 flex items-center gap-1"
            >
              <CiHome className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <BiChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-400 truncate">{product.title}</span>
          </div>
        </div>
      </div>

      {/* Product Sale Banner */}
      <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 py-6 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-red-600 mb-2">
            🔥 FLASH SALE - 80% OFF 🔥
          </h1>
          <div className="flex flex-col items-center gap-2">
            <p className="text-center text-red-600 text-sm md:text-base animate-pulse font-semibold">
              ⚡ Only {Math.floor(Math.random() * 10) + 1} items left at this
              price!
            </p>
            <div className="bg-red-100 text-red-600 py-1 px-4 rounded-full text-sm">
              ⏰ Offer ending soon!
            </div>
          </div>
        </div>
      </div>
      {/* Gurantee Items */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 py-6 px-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2 ">
              <span className="text-yellow-600 text-xl">🚚</span>
              <span className="font-medium">Free Express Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-600 text-xl">✨</span>
              <span className="font-medium">Satisfaction Guaranted</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-600 text-xl">🔒</span>
              <span className="font-medium">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
      {/* Product Details */}
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product image */}
          <div className="rounded-2xl bg-white p-4 overflow-hidden aspect-square shadow-lg ">
            {product.image && (
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <Image
                  fill
                  priority
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  alt={product.title ?? "Product Image"}
                  src={urlFor(product.image).url()}
                />
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {product.title}
            </h1>
            <p className="text-gray-600">{product.description}</p>

            {/* Price section */}
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex items-center gap-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-bold text-red-600">US</span>
                  <span className="text-5xl font-black text-red-600 tracking-tight">
                    {formatPrice(product.price).replace("$", "")}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg text-gray-400 line-through decoration-red-500/50 decoration-2">
                    {formatPrice(originalPrice)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="bg-red-600 text-white py-1 px-2 rounded text-sm font-bold animate-pulse">
                      -80%
                    </span>
                    <span className="text-red-600 text-sm font-bold">
                      MEGA SAVING
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-red-50 p-2 rounded-lg">
                <span className="text-red-600 font-bold">💰</span>
                <span className="text-red-600 font-medium text-sm">You save {formatPrice(originalPrice - product.price)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>{Math.floor(Math.random() * 50) + 20} people bought in the last hour</span>
              </div>
            </div>

            <div className="bg-gradient-to-r form-yellow-500/10 to-yellow-600/10 py-6 px-4 rounded-xl mt-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <span className="text-xl">⚡</span>
                <span className="font-bold">Limited Time Offer</span>
              </div>
              <div className="text-sm text-yellow-700 mt-1 font-medium">
                Order now before price changes
              </div>
            </div>

            {/* <AddToCartButton product={product} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
