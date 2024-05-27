import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ErrorHandler(error: Error, statusCode?: number) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        status: false,
        message: "BAD REQUEST",
        error: error.errors,
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      status: false,
      message: error.message,
    },
    { status: statusCode ?? 500 }
  );
}
