"use server";

import prisma from "@/lib/prisma";
import { getCurrentSession } from "./auth";
import { revalidatePath } from "next/cache";

export const createCart = async () => {
  const { user } = await getCurrentSession();
  if (!user) return null;

  const cart = await prisma.cart.create({
    data: {
      id: crypto.randomUUID(),
      user: user ? { connect: { id: user.id } } : undefined,
      items: {
        create: [],
      },
    },
    include: {
      items: true,
    },
  });
  return cart;
};

export const getOrCreateCart = async (cartId?: string | null) => {
  const { user } = await getCurrentSession();
  if (user) {
    const userCart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { items: true },
    });
    if (userCart) return userCart;
  }

  if (!cartId) return await createCart();

  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: { items: true },
  });

  if (!cart) return await createCart();
  return cart;
};

export const updateCartItem = async (
  cartId: string,
  sanityProductId: string,
  data: {
    title?: string;
    price?: number;
    image?: string;
    quantity?: number;
  }
) => {
  const cart = await getOrCreateCart(cartId);
  const existingItem = cart?.items.find(
    (item) => item.sanityProductId === sanityProductId
  );

  const quantity = data.quantity ?? 1;

  if (existingItem) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await prisma.cartLineItem.delete({
        where: { id: existingItem.id },
      });
    } else {
      // Update quantity if item exists
      await prisma.cartLineItem.update({
        where: { id: existingItem.id },
        data: { quantity },
      });
    }
  } else {
    if (quantity > 0) {
      // Create item if it doesn't exist and quantity is positive
      await prisma.cartLineItem.create({
        data: {
          id: crypto.randomUUID(),
          cartId: cart.id,
          sanityProductId,
          title: data.title ?? '',
          price: data.price ?? 0,
          image: data.image ?? '',
          quantity,
        },
      });
    }
    // If quantity is 0 or negative and item doesn't exist, do nothing
  }

  revalidatePath('/'); // Optional: specify the path if needed
  return getOrCreateCart(cartId);
};
