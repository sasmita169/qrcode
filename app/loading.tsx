import React, { HTMLProps } from "react";
import { cn } from "@/lib/utils";
import { LoaderCircle, LucideProps } from "lucide-react";

type Props = {
  lucideProps: LucideProps;
  wrapperProps?: HTMLProps<HTMLDivElement>;
};

export default function Loading({ lucideProps, wrapperProps }: Props) {
  if (wrapperProps) {
    const { className, ...rest } = wrapperProps;
    return (
      <div
        {...rest}
        className={cn(
          "flex animate-spin justify-center items-center",
          wrapperProps?.className
        )}
      >
        <LoaderCircle {...lucideProps} />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex animate-spin min-h-[70vh] justify-center items-center"
      )}
    >
      <LoaderCircle size={75} {...lucideProps} />
    </div>
  );
}
