import { connectDB } from '@/utilities/db';
import Product from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/middleware/auth';

interface ProductData {
  name: string;
  price: number;
  discountPrice?: number;
  buyingPrice: number;
  source: string
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
