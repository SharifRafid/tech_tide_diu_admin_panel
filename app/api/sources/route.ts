import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utilities/db";
import Source from "@/models/Source";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const data = await req.json();
    const source = await Source.create(data);

    return NextResponse.json(source, { status: 201 });
  } catch (error) {
    console.error("Error creating source:", error);
    return NextResponse.json({ error: "Failed to create source" }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    await connectDB();
    const sources = await Source.find({});
    return NextResponse.json(sources, { status: 200 });
  } catch (error) {
    console.error("Error fetching sources:", error);
    return NextResponse.json({ error: "Failed to fetch sources" }, { status: 500 });
  }
}

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

    const updatedSource = await Source.findByIdAndUpdate(id, data, { new: true });

    if (!updatedSource) {
      return NextResponse.json({ error: "Source not found" }, { status: 404 });
    }

    return NextResponse.json(updatedSource, { status: 200 });
  } catch (error) {
    console.error("Error updating source:", error);
    return NextResponse.json({ error: "Failed to update source" }, { status: 500 });
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

    const deletedSource = await Source.findByIdAndDelete(id);

    if (!deletedSource) {
      return NextResponse.json({ error: "Source not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Source deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting source:", error);
    return NextResponse.json({ error: "Failed to delete source" }, { status: 500 });
  }
}

