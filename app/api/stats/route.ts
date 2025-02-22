import { NextResponse } from "next/server";
import { connectDB } from "@/utilities/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Source from "@/models/Source";

export async function GET(): Promise<NextResponse> {
  try {
    await connectDB();
    const [
      totalProducts,
      totalOrders,
      ordersAggregation,
      sourcesCount
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalSales: { $sum: "$totalAmount" },
            totalItems: { $sum: { $size: "$items" } }
          }
        }
      ]),
      Source.countDocuments()
    ]);

    const totalSales = ordersAggregation[0]?.totalSales || 0;
    const totalProfit = totalSales * 0.3;

    const stats = {
      totalProducts,
      totalOrders,
      totalSales: Number(totalSales.toFixed(2)),
      totalProfit: Number(totalProfit.toFixed(2)),
      totalSources: sourcesCount,
      averageOrderValue: totalOrders > 0 ? Number((totalSales / totalOrders).toFixed(2)) : 0
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 });
  }
}