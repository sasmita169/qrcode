import { NextRequest, NextResponse } from "next/server";
import { ErrorHandler } from "../api-utility/error-handler";

import { string, z } from "zod";
import prisma from "@/lib/db";
import { getObjectFromIterator } from "../api-utility/utility-func";

const idSchema = z.object({
  id: z.string(),
});

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z
    .string()
    .regex(/\b\d+(\.\d{1,2})?\b/, "This is not a price*")
    .min(1, "This is required*")
    .transform((price) => parseFloat(price)),
  sku: z.string().min(1, "SKU is required"),
  batchCode: z.string().min(1, "Batch code is required"),
});

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Search filters
    const search = searchParams.get("search") || "";

    // Construct where clause with OR conditions
    const filters = [
      { name: { contains: search } },
      { id: { contains: search } },
      { sku: { contains: search } },
      { batchCode: { contains: search } },
    ].filter(Boolean);

    const whereClause = filters.length > 0 ? { OR: filters } : {};

    // Fetch filtered and paginated products
    const products = await prisma.product.findMany({
      skip,
      take,
      where: whereClause,
    });

    // Total number of filtered products
    const totalProducts = await prisma.product.count({
      where: whereClause,
    });

    return NextResponse.json({
      status: true,
      data: products,
      meta: {
        page,
        pageSize,
        total: totalProducts,
        totalPages: Math.ceil(totalProducts / pageSize),
      },
    });
  } catch (error) {
    return ErrorHandler(error as Error);
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const productData = productSchema.parse(body);

    const existingProduct = await prisma.product.findFirst({
      where: { sku: productData.sku },
    });

    if (existingProduct) {
      return NextResponse.json({
        status: false,
        message: "Product already exists with this SKU",
      });
    }

    const product = await prisma.product.create({
      data: {
        name: productData.name,
        price: productData.price,
        batchCode: productData.batchCode,
        sku: productData.sku,
        description: productData.description,
      },
    });

    return NextResponse.json({
      status: true,
      data: product,
    });
  } catch (error) {
    console.log(error);
    return ErrorHandler(error as Error);
  }
};

export const PUT = async (req: NextRequest, res: NextResponse) => {
  try {
    const body = await req.json();
    const updateSchema = productSchema.merge(idSchema);
    const productData = updateSchema.parse(body);

    const existingProduct = await prisma.product.findFirst({
      where: {
        AND: [{ sku: productData.sku }, { NOT: { id: productData.id } }],
      },
    });

    if (existingProduct) {
      return NextResponse.json({
        status: false,
        message: "Product already exists with this SKU",
      });
    }

    const product = await prisma.product.update({
      where: {
        id: productData.id,
      },
      data: {
        name: productData.name,
        price: productData.price,
        batchCode: productData.batchCode,
        sku: productData.sku,
        description: productData.description,
      },
    });

    return NextResponse.json({
      status: true,
      data: product,
    });
  } catch (error) {
    console.log("error => ", error);
    ErrorHandler(error as Error);
  }
};

export const DELETE = async (req: NextRequest, res: NextResponse) => {
  try {
    const params = getObjectFromIterator(new URL(req.url).searchParams);
    const { id } = idSchema.parse(params);

    const deletedProduct = await prisma.product.delete({ where: { id } });

    if (!deletedProduct) {
      return NextResponse.json(
        { status: false, message: "Product is not found*" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: true,
      data: { message: "Deleted product" },
    });
  } catch (error) {
    ErrorHandler(error as Error);
  }
};
