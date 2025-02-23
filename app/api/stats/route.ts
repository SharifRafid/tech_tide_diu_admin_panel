import { NextResponse } from "next/server";
import { connectDB } from "@/utilities/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Source from "@/models/Source";

export async function GET(): Promise<NextResponse> {
  try {
    await connectDB();

    // Fetch all necessary data in parallel
    const [
      totalProducts,           // Total number of products
      totalOrders,            // Total number of orders
      ordersAggregation,      // Aggregated order stats
      sourcesAggregation,     // Aggregated profit per source
      sourcesCount,           // Total number of sources
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalSales: { $sum: "$totalAmount" },           // Sum of totalAmount
            totalProductsSold: {                            // Total number of products sold (sum of quantities)
              $sum: { $sum: "$products.quantity" }
            },
            totalProfit: { $sum: "$totalProfit" },          // Sum of totalProfit
          },
        },
      ]),
      Order.aggregate([
        {
          $unwind: "$products"                            // Flatten the products array
        },
        {
          $lookup: {                                      // Join with Product to get source info
            from: "products",
            localField: "products.product",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        {
          $unwind: "$productInfo"                         // Flatten productInfo array
        },
        {
          $group: {
            _id: "$productInfo.source",                   // Group by source
            totalProfit: { $sum: "$totalProfit" },        // Sum profit per source
          },
        },
        {
          $lookup: {                                      // Join with Source to get source names
            from: "sources",
            localField: "_id",
            foreignField: "_id",
            as: "sourceInfo",
          },
        },
        {
          $unwind: "$sourceInfo"
        },
        {
          $project: {
            sourceName: "$sourceInfo.name",
            totalProfit: 1,
          },
        },
      ]),
      Source.countDocuments(),
    ]);

    // Extract aggregated values with fallback to 0 if no results
    const totalSales = ordersAggregation[0]?.totalSales || 0;
    const totalProductsSold = ordersAggregation[0]?.totalProductsSold || 0;
    const totalProfit = ordersAggregation[0]?.totalProfit || 0;

    // Prepare profit by source (assuming at least two sources for first and second)
    const profitBySource = {
      firstSource: sourcesAggregation[0] || { sourceName: "N/A", totalProfit: 0 },
      secondSource: sourcesAggregation[1] || { sourceName: "N/A", totalProfit: 0 },
    };

    // Construct the stats object
    const stats = {
      totalProducts,                          // Number of unique products in catalog
      totalOrders,                           // Number of orders placed
      totalSales: Number(totalSales.toFixed(2)), // Total sales amount across all orders
      totalProductsSold,                     // Total quantity of products sold
      totalProfit: Number(totalProfit.toFixed(2)), // Total profit across all orders
      totalSources: sourcesCount,            // Number of sources
      averageOrderValue: totalOrders > 0 ? Number((totalSales / totalOrders).toFixed(2)) : 0, // Avg sales per order
      profitFirstSource: {
        name: profitBySource.firstSource.sourceName,
        totalProfit: Number(profitBySource.firstSource.totalProfit.toFixed(2)),
      },
      profitSecondSource: {
        name: profitBySource.secondSource.sourceName,
        totalProfit: Number(profitBySource.secondSource.totalProfit.toFixed(2)),
      },
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 });
  }
}