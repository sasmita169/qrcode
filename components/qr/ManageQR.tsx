"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "../ui/use-toast";
import { Pagination, QrCodeResponse } from "./types";
import { formatDate, objectToQuery } from "@/lib/utils";
import { Product, QrCode } from "@prisma/client";
import { ArrowLeft, Check, CircleSlash, Info } from "lucide-react";
import { Button } from "../ui/button";
import { ProductResponse } from "../products/types";
import { H2, H3, Large, List, P, Small } from "../ui/Typography";
import { useRouter } from "next/navigation";
import QrCodeComponent from "./QrCode";
import { useReactToPrint } from "react-to-print";
import Loader from "../loaders/Loader";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Separator } from "../ui/separator";

const paginationValue: Pagination = {
  page: 1,
  pageSize: 5,
  totalPages: 2,
  total: 10,
};

const ManageQR = ({ id }: { id: string }) => {
  const router = useRouter();
  const qrRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const [qrCode, setQrCode] = useState<QrCode | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingQr, setIsLoadingQr] = useState<boolean>(false);

  const fetchProduct = useCallback(async () => {
    try {
      setIsLoading(true);
      const query = objectToQuery({
        search: id,
      });
      const res = await fetch(`/api/products?${query}`);
      const { status, data }: ProductResponse = await res.json();

      if (status && Array.isArray(data) && data.length > 0) {
        setProduct(data[0]);
      }
    } catch (error) {
      return toast({
        title: "Failed.",
        variant: "destructive",
        description: "Could not get the product and qr",
      });
    } finally {
      setIsLoading(false);
    }
  }, [id, toast]);

  const getQr = useCallback(async () => {
    try {
      setIsLoading(true);
      const query = objectToQuery({
        productId: id,
        latest: "1",
      });
      const res = await fetch(`/api/product-qr/manage?${query}`, {
        method: "GET",
      });

      const { status, data }: QrCodeResponse = await res.json();
      if (status && Array.isArray(data) && data.length > 0) {
        setQrCode(data.at(0));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const handleCreateQR = async () => {
    try {
      setIsLoadingQr(true);

      const res = await fetch(`/api/product-qr/manage`, {
        method: "POST",
        body: JSON.stringify({ productId: id }),
      });

      const { status, data }: QrCodeResponse = await res.json();

      if (status && data) {
        setQrCode(data);
      }

      return toast({
        title: "Success",
        description: (
          <div className="flex gap-2 items-center my-2">
            <Check />
            <span>Created a new QR for product id: {id}</span>
          </div>
        ),
      });
    } catch (error) {
      return toast({
        title: "Some Error Occured !",
        description: (
          <div className="flex items-center gap-2">
            <CircleSlash />
            <span>Try again later</span>
          </div>
        ),
      });
    } finally {
      setIsLoadingQr(false);
    }
  };

  const handleQrPrint = useReactToPrint({
    content: () => qrRef.current,
  });

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    getQr();
  }, [getQr]);

  if (isLoading) {
    return (
      <Card className="md:max-w-6xl my-12 mx-auto shadow-md min-h-[500px] p-6 flex justify-center items-center gap-3">
        <div className="flex items-center gap-3 flex-col">
          <Loader lucideProps={{ size: 50 }} />
          <Large>Getting relevant data..</Large>
        </div>
      </Card>
    );
  }

  if (!product) {
    return (
      <Card className="md:max-w-6xl my-12 mx-auto shadow-md min-h-[500px] p-6 flex justify-center items-center gap-3">
        <div className="flex items-center gap-3 flex-col">
          <H2>No Product Found!</H2>
          <Button
            className="flex gap-2 items-center"
            onClick={() => router.back()}
          >
            <ArrowLeft size={20} /> Back
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="md:max-w-6xl grid mx-auto">
      <div className="flex justify-start">
        <Button
          className="flex gap-2 items-center"
          variant={"secondary"}
          onClick={() => router.back()}
        >
          <ArrowLeft size={20} /> Back
        </Button>
      </div>
      <Card className="shadow-md p-6 grid md:grid-cols-2 gap-3 my-3">
        <div className="flex justify-start flex-col">
          <H3>Product Details</H3>
          <List className="[&>li]:text-lg font-medium my-8">
            <li>Product ID: {product.id}</li>
            <li>Product Name: {product.name}</li>
            <li>Product Price: {product.price.toLocaleString()}</li>
            <li>Product Sku: {product.sku}</li>
            <li>Product Batch: {product.batchCode}</li>
            <li>Created At: {formatDate(product.createdAt)}</li>
            <li>Updated At: {formatDate(product.updatedAt)}</li>
          </List>
        </div>
        <div>
          <div className="flex justify-between">
            <H3>Product QR Code</H3>
            <HoverCard>
              <HoverCardTrigger>
                <Info />
              </HoverCardTrigger>
              <HoverCardContent>
                <div className="flex flex-col gap-2">
                  <Small>
                    <span>Created At: </span>
                    {qrCode
                      ? formatDate(qrCode.createdAt, "hh:mm A DD/MM/YYYY")
                      : null}
                  </Small>
                  <Separator className="my-2" />
                  <Small>
                    <span>Is QR Code Used: </span>
                    {qrCode ? (qrCode.isUsed ? "Yes" : "No") : null}
                  </Small>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          <div className="flex flex-col items-center my-3 gap-4">
            <QrCodeComponent
              ref={qrRef}
              isLoading={isLoadingQr}
              handleCreateQR={handleCreateQR}
              handleQrPrint={handleQrPrint}
              imageSrc={qrCode?.qrCodeData ?? null}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ManageQR;
