import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { Product } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import ProductForm from "./ProductsForm";
import { H4 } from "../ui/Typography";
import { useRouter } from "next/navigation";

type Props = {
  row: Product;
  onRefresh: () => void;
  handleDelete: (id: string) => {};
};

const Action = ({ row, handleDelete, onRefresh }: Props) => {
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const router = useRouter();

  const navigate = () => router.push(`/products/product-qr/${row.id}`);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <Ellipsis />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* DIALOG */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogTrigger
            className={`${buttonVariants({
              variant: "ghost",
            })} w-full focus-visible:ring-0`}
          >
            Edit Product
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Products</DialogTitle>
            </DialogHeader>
            <ProductForm
              onRefresh={onRefresh}
              onClose={() => setIsEditOpen(false)}
              currentProduct={row}
            />
          </DialogContent>
        </Dialog>
        <DropdownMenuSeparator />
        {/* QR Code */}
        <DropdownMenuItem className="p-0">
          <Button onClick={navigate} variant={"ghost"} className="p-0 w-full">
            Create Qr Code
          </Button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {/* DIALOG */}
        <Dialog>
          <DialogTrigger
            className={`${buttonVariants({
              variant: "destructive",
            })} w-full focus-visible:ring-0`}
          >
            Delete
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmation!</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col justify-center gap-3">
              <H4>Are you sure ? This action is irreversible!</H4>
              <Button
                onClick={() => handleDelete(row.id)}
                size={"lg"}
                variant={"destructive"}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Action;
