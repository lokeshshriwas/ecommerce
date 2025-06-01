import Form from "next/form";
import React from "react";
import { CiSearch } from "react-icons/ci";
const HeaderSearchBar = () => {
  return (
    <Form action={"/search"}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
          <CiSearch className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          name="query"
          placeholder="Search..."
          className="w-32 pl-8 pr-2 py-1 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-black focus:border-transparent transition-colors"
        />
      </div>
    </Form>
  );
};

export default HeaderSearchBar;
