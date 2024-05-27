import React from "react";
import DataTable, { ColumnConfig } from "../tables/DataTable";
import { Product } from "@prisma/client";
import { formatDate, formatNumber } from "@/lib/utils";
import Action from "./Action";

type Props = {
  products: Product[] | null;
  onDelete: (id: string) => {};
  onRefresh: () => void;
};

const ProductTable = ({ products, onDelete, onRefresh }: Props) => {
  const columns: ColumnConfig<Product>[] = [
    {
      key: "id",
      headerText: "ID",
      formatter: (value) => (
        <span className="max-w-[16px] break-words">{value}</span>
      ),
    },
    { key: "name", headerText: "Product Name" },
    { key: "batchCode", headerText: "Product Batch" },
    {
      key: "createdAt",
      headerText: "Created At",
      formatter: (value) => (
        <span className="max-w-[16px] break-words">{formatDate(value)}</span>
      ),
    },
    {
      key: "updatedAt",
      headerText: "Updated At",
      formatter: (value) => (
        <span className="max-w-[16px] break-words">{formatDate(value)}</span>
      ),
    },
    {
      key: "price",
      headerText: "Price",
      formatter: (value) => <span>{formatNumber(value)}</span>,
    },
    { key: "sku", headerText: "SKU" },
    {
      key: "actions",
      headerText: "Action",
      formatter: (value, row) => {
        return (
          <Action onRefresh={onRefresh} row={row} handleDelete={onDelete} />
        );
      },
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={products} />
    </>
  );
};

export default ProductTable;
