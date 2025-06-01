import { getAllCategories } from "@/sanity/lib/client";
import { FaAngleDown } from "react-icons/fa6";
import React from "react";
import Link from "next/link";

const HeaderCategorySelector = async () => {
  const categories = await getAllCategories();
  return (
    <div className="relative inline-block">
      <button className="peer group text-gray-700 hover:text-gray-900 text-sm font-medium flex items-center gap-1">
        Categories
        <FaAngleDown className="transition-transform duration-200 group-hover:rotate-180" />
      </button>

      <div className="absolute top-full left-0 pt-2 opacity-0 invisible peer-hover:opacity-100 peer-hover:visible hover:opacity-100 hover:visible transition-all duration-200">
        <div className="w-64 bg-white rounded-lg shadow-xl border-gray-100 overflow-hidden">
          <div className="py-2">
            {categories.map((category) => (
              <Link
                href={`/category/${category.slug?.current}`}
                key={category._id}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colos duration-100"
                prefetch
              >
                {category.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderCategorySelector;
