"use client";

import { getObjectFromIterator } from "@/app/api/api-utility/utility-func";
import Loader from "@/components/loaders/Loader";
import { QrVerifyResponse } from "@/components/products/types";
import { H1, H2, H3, P, Small } from "@/components/ui/Typography";
import { useToast } from "@/components/ui/use-toast";
import { objectToQuery } from "@/lib/utils";
import { CircleSlash } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

type Props = {};

type StatusCode = 404 | 401 | 200 | 400;

type Content = {
  [key in StatusCode]: JSX.Element;
};

const Verify = (props: Props) => {
  const iterator = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [productStatus, setProductStatus] = useState<number | null>();
  const params: Record<string, any> = getObjectFromIterator(iterator);

  const verifyProduct = useCallback(async () => {
    try {
      setIsLoading(true);

      const query = objectToQuery(params);
      const res = await fetch(`/api/product-qr/verify?${query}`, {
        method: "GET",
      });

      if (res.status === 400) {
        setProductStatus(res.status);
        return toast({
          title: "Failed",
          description: "Qr information is not valid.",
          variant: "destructive",
        });
      }

      const { status, message, code }: QrVerifyResponse = await res.json();
      setProductStatus(code);
      if (status) {
        return toast({
          title: "Success",
          description: message,
        });
      } else {
        return toast({
          title: "Failed",
          description: message,
          variant: "destructive",
        });
      }
    } catch (error) {
      return toast({
        title: "Failed",
        description: "Server failure",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyProduct();
  }, [verifyProduct]);

  if (isLoading) {
    return (
      <div className="flex min-h-[75vh] justify-center items-center">
        <Loader lucideProps={{ size: 50 }} />
      </div>
    );
  }

  if (!productStatus) {
    return (
      <div className="flex min-h-[75vh] justify-center items-center">
        <H3>Server Error</H3>
      </div>
    );
  }

  const content: Content = {
    400: (
      <div className="min-h-[75vh] flex flex-col justify-center items-center">
        <H2>We could not identify this product !</H2>
        <P>We could not identify this product !</P>
      </div>
    ),
    404: (
      <div className="min-h-[75vh] flex justify-center items-center">
        <H2>There is no product found !</H2>
      </div>
    ),
    401: (
      <div className="min-h-[75vh] flex flex-col justify-center items-center">
        <H2>This product is already verified !</H2>
        <P>
          If you are trying to verify it again, there is no need to. However if
          you are doing this for the first time, please report if to us.
        </P>
      </div>
    ),
    200: (
      <div className="min-h-[75vh] flex flex-col justify-center items-center">
        <H1>Congratulations</H1>
        <H2>This product is authentic and has been verified !</H2>
      </div>
    ),
  };

  const codes = Object.keys(content).includes(productStatus.toString());

  if (codes) {
    return <div>{content[productStatus as keyof Content]}</div>;
  }

  return (
    <div>
      <H2>Server Error</H2>
    </div>
  );
};

export default Verify;
