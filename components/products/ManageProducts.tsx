"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import ProductForm from "@/components/products/ProductsForm";
import ProductTable from "./ProductTable";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button, buttonVariants } from "../ui/button";
import { useToast } from "../ui/use-toast";
import Loader from "../loaders/Loader";
import { Pagination, ProductResponse } from "./types";
import { Product } from "@prisma/client";
import { Check, CircleSlash } from "lucide-react";
import { Input } from "../ui/input";
import PaginationComponent from "../tables/Pagination";
import { objectToQuery } from "@/lib/utils";

const paginationValue: Pagination = {
  page: 1,
  pageSize: 5,
  totalPages: 2,
  total: 10,
};

const ManageProducts = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModal, setIsModal] = useState<boolean>(false);

  const [pagination, setPagination] = useState<Pagination>(paginationValue);
  const [searchObj, setSearchObj] = useState({ search: "" });
  const searchRef = useRef<HTMLInputElement>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const query = objectToQuery({
        search: searchObj.search,
        page: pagination.page.toString(),
        pageSize: pagination.pageSize.toString(),
      });
      const res = await fetch(`/api/products?${query}`);
      const { status, data, meta }: ProductResponse = await res.json();

      if (status) {
        setPagination(meta);
        setProducts(data);
      }
    } catch (error) {
      return toast({
        title: "Failed.",
        variant: "destructive",
        description: "Could not get the products.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, pagination.page, pagination.pageSize, searchObj.search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDeleteProduct = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok && products) {
        setProducts(products.filter((p) => p.id !== id));
        return toast({
          title: "Success.",
          description: (
            <div className="flex gap-2 items-center my-2">
              <Check />
              Product is deleted!.
            </div>
          ),
        });
      }
    } catch (error) {
      return toast({
        title: "Failed.",
        description: (
          <div className="flex gap-2 items-center my-2">
            <CircleSlash /> Could not delete the product.
          </div>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="md:max-w-7xl grid gap-2 mx-auto">
      <Card className="shadow-md p-6 min-h-[450px] grid gap-3 my-12">
        <div className="flex gap-3">
          <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
          <Dialog open={isModal} onOpenChange={setIsModal}>
            <DialogTrigger
              className={`w-fit ml-auto ${buttonVariants({
                variant: "default",
              })}`}
            >
              Add Product
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Products</DialogTitle>
              </DialogHeader>
              <ProductForm
                onRefresh={fetchProducts}
                onClose={() => setIsModal(false)}
                currentProduct={null}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid md:grid-cols-3">
          <div>
            <label htmlFor="search">Search:</label>
            <div className="flex gap-3">
              <Input
                ref={searchRef}
                placeholder="Search by product id, name, sku, product batch.."
              />
              <Button
                onClick={() =>
                  setSearchObj({
                    ...searchObj,
                    search: searchRef?.current?.value ?? "",
                  })
                }
              >
                Search
              </Button>
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="py-12">
            <Loader lucideProps={{ size: 50 }} />
          </div>
        ) : (
          <>
            <ProductTable
              onRefresh={fetchProducts}
              products={products}
              onDelete={handleDeleteProduct}
            />
            <div className="my-2">
              <PaginationComponent
                currentPage={pagination.page}
                onPageChange={(n) => setPagination({ ...pagination, page: n })}
                pageSize={pagination.pageSize}
                total={pagination.total}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ManageProducts;
