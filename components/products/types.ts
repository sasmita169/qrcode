import { Product } from "@prisma/client";

export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type ProductResponse = {
  status: boolean;
  data: Product[];
  meta: Pagination;
};

export type QrVerifyResponse = {
  status: boolean;
  message: string;
  code: number;
};
