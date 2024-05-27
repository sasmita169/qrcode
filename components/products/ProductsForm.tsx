"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
import Loading from "@/app/loading";
import { Large } from "../ui/Typography";
import { Product } from "@prisma/client";
import { Check, CircleSlash } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(1, "This is required*"),
  description: z.string().optional(),
  price: z
    .string()
    .regex(/\b\d+(\.\d{1,2})?\b/, "This is not a price*")
    .min(1, "This is required*"),
  sku: z.string().min(1, "This is required*"),
  batchCode: z.string().min(1, "This is required*"),
});

type ProductSchema = z.infer<typeof productSchema>;

const formFields = [
  { label: "Name", name: "name", type: "text", placeholder: "Enter name.." },
  {
    label: "Batch Code",
    name: "batchCode",
    type: "text",
    placeholder: "Enter batch number..",
  },
  {
    label: "Price",
    name: "price",
    type: "number",
    placeholder: "Enter price..",
  },
  { label: "SKU", name: "sku", type: "text", placeholder: "Enter sku.." },
  {
    label: "Description",
    name: "description",
    type: "textarea",
    placeholder: "Describe your product..",
  },
];

const defaultValues = {
  name: "",
  batchCode: "",
  price: "",
  sku: "",
  description: "",
};

type Props = {
  currentProduct: Product | null;
  onRefresh: () => void;
  onClose: () => void;
};

const ProductForm = ({ currentProduct, onClose, onRefresh }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductSchema>({
    defaultValues,
    resolver: zodResolver(productSchema),
  });

  const submitHandler: SubmitHandler<ProductSchema> = async (data) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/products", {
        method: currentProduct ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          currentProduct ? { id: currentProduct.id, ...data } : data
        ),
      });

      if (res.ok) {
        const { status, message }: { status: boolean; message: string } =
          await res.json();
        if (status) {
          onRefresh();
          reset(defaultValues);
          onClose();
          return toast({
            title: "Success",
            description: (
              <div className="flex gap-2 items-center my-2">
                <Check />
                {currentProduct ? "Updated" : "Added"} a product.
              </div>
            ),
          });
        }
        throw new Error(message ?? "Could not add the product.");
      }
    } catch (error: unknown) {
      return toast({
        title: "Failed",
        description:
          error instanceof Error ? (
            <div className="flex gap-2 items-center my-2">
              <CircleSlash /> {error.message}
            </div>
          ) : (
            <div className="flex gap-2 items-center my-2">
              <CircleSlash /> Could not add the product.
            </div>
          ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (name: keyof ProductSchema) => {
    const error = errors[name];
    if (error) {
      return (error as { message?: string }).message || "Correct";
    }
    return null;
  };

  useEffect(() => {
    if (currentProduct) {
      const { id, createdAt, updatedAt, description, price, ...rest } =
        currentProduct;
      reset({
        ...rest,
        description: description ?? undefined,
        price: price.toString(),
      });
    }
  }, [currentProduct, reset]);

  return (
    <Card className="mb-6 p-4">
      <h2 className="text-2xl font-bold mb-4">
        {currentProduct ? "Update Product" : "Add New Product"}
      </h2>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="grid md:grid-cols-2 gap-3"
      >
        {formFields.map((field) => (
          <div
            className={`${field.type === "textarea" ? "md:col-span-2" : ""}`}
            key={field.name}
          >
            <label htmlFor={field.name} className="block text-sm font-medium">
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <Textarea
                {...register(field.name as keyof ProductSchema)}
                placeholder={field.placeholder}
                id={field.name}
                className="mt-1 block"
              />
            ) : (
              <Input
                {...register(field.name as keyof ProductSchema)}
                placeholder={field.placeholder}
                id={field.name}
                type={field.type}
                className="mt-1 block w-full"
              />
            )}
            {getErrorMessage(field.name as keyof ProductSchema) && (
              <p className="text-red-500 text-sm">
                {getErrorMessage(field.name as keyof ProductSchema)}
              </p>
            )}
          </div>
        ))}
        <Button
          disabled={isLoading}
          className="md:col-span-2 text-lg font-semibold my-2 flex items-center gap-2"
          type="submit"
          variant="default"
        >
          {isLoading ? (
            <>
              <Loading lucideProps={{ size: 20 }} />
              <Large>Saving..</Large>
            </>
          ) : (
            <>{currentProduct ? "Update Product" : "Add Product"}</>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default ProductForm;
