import { QrCode } from "@prisma/client";

export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type QrCodeResponse = {
  status: boolean;
  data: QrCode;
  meta: Pagination;
};
