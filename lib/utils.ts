import { type ClassValue, clsx } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: string | Date, format?: string) => {
  const newDate = moment(new Date(date)).format(format ?? "DD/MM/YYYY");
  return newDate;
};

export const formatNumber = (num: number) => {
  return num.toLocaleString();
};

export const objectToQuery = (obj: { [x: string]: string }) => {
  return Object.entries(obj)
    .filter(([key, value]) => !!value)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
};
