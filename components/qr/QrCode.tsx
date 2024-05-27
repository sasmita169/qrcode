import Image from "next/image";
import React, { forwardRef } from "react";
import { H3 } from "../ui/Typography";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import CardSkeleton from "../loaders/CardSkeleton";

type Props = {
  isLoading: boolean;
  handleQrPrint: () => void;
  handleCreateQR: () => void;
  imageSrc: string | null;
};

const QrCode = forwardRef<HTMLDivElement, Props>(
  ({ imageSrc, handleCreateQR, handleQrPrint, isLoading }, ref) => {
    if (isLoading) {
      return (
        <div>
          <CardSkeleton />
          <H3 className="text-center">Getting the QR Code..</H3>
        </div>
      );
    }

    return (
      <div>
        <div className="grid gap-2">
          {imageSrc ? (
            <>
              <div
                ref={ref}
                className="flex flex-col gap-2 print:flex print:justify-center print:items-center print:h-screen"
              >
                <Image
                  src={imageSrc}
                  width={400}
                  height={400}
                  alt="QR CODE"
                  className="print:block print:m-auto"
                />
              </div>
            </>
          ) : (
            <div className="min-h-[450px] flex items-center">
              <H3>QR is not available</H3>
            </div>
          )}
          <div className="flex justify-center pt-2 gap-2">
            <Button onClick={handleQrPrint}>Print QR</Button>
            <Button onClick={handleCreateQR}>Create a new QR</Button>
          </div>
        </div>
      </div>
    );
  }
);

QrCode.displayName = "QrCode";

export default QrCode;
