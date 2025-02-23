import { connectDB } from '@/utilities/db';
import Order from '@/models/Order'; // Assuming Order model is stored in models/Order.ts
import { auth } from '@/middleware/auth';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
      }); // Populate products and Order
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

export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id, data } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required for update" }, { status: 400 });
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, data, { new: true });

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("Error updating Order:", error);
    return NextResponse.json({ error: "Failed to update Order" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required to delete" }, { status: 400 });
    }

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting Order:", error);
    return NextResponse.json({ error: "Failed to delete Order" }, { status: 500 });
  }
}

