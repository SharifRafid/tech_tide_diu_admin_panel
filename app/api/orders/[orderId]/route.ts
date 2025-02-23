import { connectDB } from '@/utilities/db';
import Order from '@/models/Order'; // Assuming Order model is stored in models/Order.ts
import { auth } from '@/middleware/auth';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();
    await auth(req); // Assuming your auth middleware works with NextRequest

    const orders = await Order.findById(req.pa)
      .populate({
        path: 'products.product',
        populate: { path: 'source' }
      }); // Populate products and Order
    return NextResponse.json(orders, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 400 });
  }
};
