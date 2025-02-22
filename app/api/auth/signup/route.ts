import User from "@/models/User";
import { connectDB } from "@/utilities/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
      const { email, password } = await req.json();
      await connectDB();
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ message: "User already exists" }, { status: 400 });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();
  
      return NextResponse.json({ message: "User created" }, { status: 201 });
    } catch (error) {
      console.error(error);  // Log the error for debugging
      return NextResponse.json({ message: "Error creating user", error: error.message }, { status: 500 });
    }
  }
  