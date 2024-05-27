import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type ColumnConfig<T> = {
  key: keyof T | string;
  headerText: string;
  formatter?: (value: any, data: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: ColumnConfig<T>[];
  data: T[] | null;
  action?: React.ReactNode;
};

const DataTable = <T,>({ columns, data, action }: DataTableProps<T>) => {
  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          {columns.map((column, index) => (
            <TableHead key={index}>{column.headerText}</TableHead>
          ))}
          {action && <TableHead>Action</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data &&
          data.map((item, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column, colIndex) => (
                <TableCell key={`${rowIndex}-${colIndex}`}>
                  {column.formatter
                    ? column.formatter(item[column.key as keyof T], item)
                    : String(item[column.key as keyof T])}
                </TableCell>
              ))}
              {action && <TableCell>{action}</TableCell>}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default DataTable;
