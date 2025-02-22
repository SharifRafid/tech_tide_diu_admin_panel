import { connectDB } from '@/utilities/db';
import Order from '@/models/Order'; // Assuming Order model is stored in models/Order.ts
import { auth } from '@/middleware/auth';
import { NextRequest, NextResponse } from 'next/server';

// Define the type for order data
interface ProductInOrder {
  product: string; // Assuming ObjectId of Product as string
  quantity: number;
  adjustedPrice?: number;
}

interface OrderData {
  title: string;
  customerName: string;
  email?: string;
  phone: string;
  address: string;
  deliveryCharge?: number;
  paymentMethod?: string;
  products: ProductInOrder[];
  totalAmount: number;
  totalProfit: number;
}

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();
    await auth(req); // Assuming your auth middleware works with NextRequest

    const orders = await Order.find({})
      .populate({
        path: 'products.product',
        populate: { path: 'source' }
      }); // Populate products and source
    return NextResponse.json(orders, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 400 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    await auth(req); // Assuming your auth middleware works with NextRequest

    const orderData: OrderData = await req.json(); // Parsing and specifying type for the body

    const order = await Order.create(orderData); // Creating the order in DB
    return NextResponse.json(order, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 400 });
  }
};
