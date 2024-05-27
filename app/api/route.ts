import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    return NextResponse.json({ status: true, message: "Welcome to the app!" });
  } catch (error) {
    console.log(error);
  }
};
