"use client";

import React, { useActionState } from "react";
import Form from "next/form";
import { BiLoader } from "react-icons/bi";
const initialState = {
  message: "",
};

type SignInProps = {
  action: (
    state: { message: string } | undefined,
    formData: FormData
  ) => Promise<{ message: string } | undefined>;
};

const SignIn = ({ action }: SignInProps) => {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <Form
      action={formAction}
      className="max-w-md mx-auto my-16 p-8 bg-gray-100 rounded-lg shadow-md"
    >
      <h1 className="text-2xl font-bold text-center mb-2 text-black">
        Welcome Back!
      </h1>
      <p className="text-center text-sm text-rose-600 font-semibold mb-2">
        🔥 MEMBER EXCLUSIVE 🔥
      </p>
      <p className="text-center text-sm text-gray-500 font-semibold mb-6">
        Sign in to access your exclusive memeber deals.
      </p>

      <div className="space-y-6">
        {/* email */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-800"
          >
            Email address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            autoComplete="email"
            required
            className="text-gray-500 w-full px-4 py-3 border border-gray-400 rounded-md focus:ring-1 focus:ring-black focus:border-transparent transition-colors"
            placeholder="Enter your email"
          />
        </div>

        {/* password */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-800"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            autoComplete="new-password"
            required
            className="text-gray-500 w-full px-4 py-3 border border-gray-400 rounded-md focus:ring-1 focus:ring-black focus:border-transparent transition-colors"
            placeholder="Enter your password"
          />
        </div>

        {/* Copywriting */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">
            ⚡ Members save an extra 15% on all orders!
          </p>
          <p className="text-xs text-gray-500 mb-4">
            🔏 Plus get free shipping on orders over ₹300
          </p>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isPending}
          className={`w-full bg-rose-600 text-white py-3 rounded-md hover:bg-rose-700 transition-colors font-medium flex items-center justify-center gap-2 ${isPending && 'cursor-not-allowed'}`}
        >
            {
                isPending ? (
                    <>
                       <BiLoader className="h-4 w-4 animate-spin"/>
                        SIGNING IN...
                    </>
                ) : (
                    'SIGN IN'
                )
            }
        </button>

        {
          state?.message && state.message.length > 0 && (
            <p className="text-center text-sm text-red-600">{state.message}</p>
          )
        }
      </div>
    </Form>
  );
};

export default SignIn;
