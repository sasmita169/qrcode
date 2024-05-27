import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { Product, QrCode } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { H4 } from "../ui/Typography";

type Props = {
  row: QrCode;
  onRefresh: () => void;
  handleDelete: (id: string) => {};
};

const Action = ({ row, handleDelete }: Props) => {
  // const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <Ellipsis />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
