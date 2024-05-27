import prisma from "@/lib/db";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import config from "@/lib/config";
import { getObjectFromIterator } from "../../api-utility/utility-func";
import { ErrorHandler } from "../../api-utility/error-handler";

const SECRET_KEY = config.NEXTAUTH_SECRET;

const ParamsSchema = z.object({
  productId: z.string().min(1, "This is required*"),
  identifier: z.string().min(1, "This is required*"),
  signature: z.string().min(1, "This is required*"),
});

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const params = getObjectFromIterator(searchParams);

    // Validate query parameters against schema
    const validatedParams = ParamsSchema.parse(params);
    const { productId, identifier, signature } = validatedParams;

    // Validate the signature
    const qrData = JSON.stringify({ productId, secret: identifier });
    const expectedSignature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(qrData)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({
        status: false,
        code: 400,
        message: "Invalid QR code",
      });
    }

    // Check if the QR code is valid and not used
    const qrCode = await prisma.qrCode.findFirst({
      where: {
        productId,
        secret: identifier,
      },
    });

    if (!qrCode) {
      return NextResponse.json({
        status: false,
        code: 404,
        message: "No product is found",
      });
    }

    if (qrCode.isUsed) {
      return NextResponse.json({
        status: false,
        code: 401,
        message: "QR code has already been used",
      });
    }

    // Mark the QR code as used
    await prisma.qrCode.update({
      where: { id: qrCode.id },
      data: { isUsed: true },
    });

    return NextResponse.json({
      status: true,
      code: 200,
      message: "Your Product is valid and has been verified.",
    });
  } catch (error) {
    return ErrorHandler(error as Error);
  }
};
