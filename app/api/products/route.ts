import { connectDB } from '@/utilities/db';
import Product from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/middleware/auth';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface ProductData {
  name: string;
  price: number;
  discountPrice?: number;
  buyingPrice: number;
  Product: string
  image?: string;
  description?: string;
  shortDescription?: string;
}

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();
    
    await auth(req); 

    const products = await Product.find({}).populate('source');
    return NextResponse.json(products, { status: 200 });
  } catch (error: unknown) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 400 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    await auth(req);

    const productData: ProductData = await req.json(); // Parsing and specifying type for the body

    const product = await Product.create(productData); // Creating the product in DB
    return NextResponse.json(product, { status: 201 });
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

    const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error updating Product:", error);
    return NextResponse.json({ error: "Failed to update Product" }, { status: 500 });
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

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting Product:", error);
    return NextResponse.json({ error: "Failed to delete Product" }, { status: 500 });
  }
}

