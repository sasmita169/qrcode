import QRCode from "qrcode";
import crypto from "crypto";
import prisma from "@/lib/db";
import config from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";
import { ErrorHandler } from "../../api-utility/error-handler";
import { getObjectFromIterator } from "../../api-utility/utility-func";

const SECRET_KEY = config.NEXTAUTH_SECRET;
const BASE_URL = config.BASE_URL;

export const GET = async (req: NextRequest) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      productId,
      latest,
    } = getObjectFromIterator(new URL(req.url).searchParams);
    const skip = (page - 1) * pageSize;
    const take = parseInt(pageSize, 10);

    const qrCodes = await prisma.qrCode.findMany({
      where: { OR: [{ productId, isUsed: false }] },
      skip,
      take: latest ? parseInt(latest, 10) : take,
    });

    const totalQrCodes = await prisma.qrCode.count();

    return NextResponse.json({
      status: true,
      data: qrCodes,
      meta: {
        page,
        pageSize,
        data: totalQrCodes,
        totalPages: Math.ceil(totalQrCodes / pageSize),
      },
    });
  } catch (error) {
    return ErrorHandler(error as Error);
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const { productId } = await req.json();

    // Generate a random secret for additional uniqueness
    const secret = crypto.randomBytes(32).toString("hex");

    // QR data structure containing the product ID and the secret
    const qrData = JSON.stringify({ productId, secret });

    // Create an HMAC signature using the qrData and a secret key
    const signature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(qrData)
      .digest("hex");

    // Generate the URL for verification
    const verificationUrl = `${BASE_URL}/product/verification?productId=${productId}&identifier=${secret}&signature=${signature}`;

    // Generate the QR code data URL
    const qrCodeData = await QRCode.toDataURL(verificationUrl);

    // Save the QR code details to the database
    const qrCode = await prisma.qrCode.create({
      data: {
        qrCodeData,
        secret,
        productId,
      },
    });

    return NextResponse.json({
      status: true,
      data: qrCode,
    });
  } catch (error) {
    return ErrorHandler(error as Error);
  }
};

export const PUT = async (req: NextRequest) => {
  try {
    const { id, isUsed } = await req.json();

    const qrCode = await prisma.qrCode.update({
      where: { id },
      data: { isUsed },
    });

    return NextResponse.json({
      status: true,
      data: qrCode,
    });
  } catch (error) {
    return ErrorHandler(error as Error);
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const { id } = await req.json();

    await prisma.qrCode.delete({
      where: { id },
    });

    return NextResponse.json({
      status: true,
      data: { message: "QR code deleted" },
    });
  } catch (error) {
    return ErrorHandler(error as Error);
  }
};
