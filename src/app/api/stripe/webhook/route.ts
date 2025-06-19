import prisma from "@/lib/prisma";
import { createClient } from "next-sanity";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
    // Get stripe client
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2025-05-28.basil",
    });

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    // Get sanity client
    const sanityClient = createClient({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        apiVersion: "2025-05-28.basil",
        token : process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN,
    });

    try {
        const body = await req.text();
        const headerList = await headers();
        const signature = req.headers.get("stripe-signature");

        if(!signature) {
            return NextResponse.json({ error: "No signature found" }, { status: 400 });
        }

        let event;

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (error) {
            console.log("Event couldn't be constructed", error);
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                const cartId = session?.metadata?.cartId;
                const userId = session?.metadata?.userId;

                if(!cartId){
                    throw new Error('No cart id in session metadata');
                }
                
                const cart = await prisma.cart.findUnique({
                    where : {
                        id : cartId
                    },
                    include : {
                        items : true
                    }
                });

                if(!cart){
                    throw new Error('Cart not found');
                }
                await sanityClient.create({
                    _type : 'order',
                    orderNumber : session.id.slice(-8).toUpperCase(),
                    orderDate : new Date().toISOString(),
                    customerId : userId !== '-' ? userId : null,
                    customerEmail : session.customer_details?.email ?? null,
                    customerName : session.customer_details?.name ?? null,
                    stripeCustomerId : typeof session.customer === 'object' ? session.customer?.id || "" : session.customer,
                    stripeSessionCheckoutSessionId : session.id,
                    stripePaymentIntentId : session.payment_intent,
                    totalPrice : Number(session.amount_total) / 100,
                    shippingAddress : {
                        _type : 'address',
                        name : session.customer_details?.name ?? '',
                        line1 : session.customer_details?.address?.line1 ?? '',
                        line2 : session.customer_details?.address?.line2 ?? '',
                        city : session.customer_details?.address?.city ?? '',
                        state : session.customer_details?.address?.state ?? '',
                        postalCode : session.customer_details?.address?.postal_code ?? '',
                        country : session.customer_details?.address?.country ?? ''
                    },
                    orderItems : cart.items.map((item) => ({
                        _type : 'orderItem',
                        _key : item.id,
                        product : {
                            _type : 'reference',
                            _ref : item.id
                        },
                        quantity : item.quantity,
                        price: item.price
                    })),
                    status  : 'pending',
                    _createdAt : new Date(),
                    _updatedAt : new Date(),
                    cart : {
                        _type : 'reference',
                        _ref : cartId
                    },
                    user : {
                        _type : 'reference',
                        _ref : userId
                    }
                })
                await prisma.cart.delete({
                    where : {
                        id : cartId
                    }
                })
                break;
            }
            default: {
                return NextResponse.json({ error: `Unhandled event type : ${event.type}` }, { status: 400 });
            }
        }
    } catch (error) {
        console.log('Something went wrong', error);
    }
}