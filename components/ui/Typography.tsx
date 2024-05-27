import { cn } from "@/lib/utils";
import React from "react";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export function H1({ className, children }: HeadingProps) {
  return (
    <h1
      className={cn(
        `scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl`,
        className
      )}
    >
      {children}
    </h1>
  );
}

export function H2({ className, children }: HeadingProps) {
  return (
    <h2
      className={cn(
        `scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0`,
        className
      )}
    >
      {children}
    </h2>
  );
}

export function H3({ className, children }: HeadingProps) {
  return (
    <h3
      className={cn(
        `scroll-m-20 text-2xl font-semibold tracking-tight`,
        className
      )}
    >
      {children}
    </h3>
  );
}

export function H4({ className, children }: HeadingProps) {
  return (
    <h4
      className={cn(
        `scroll-m-20 text-xl font-semibold tracking-tight`,
        className
      )}
    >
      {children}
    </h4>
  );
}

export function P({ className, children }: HeadingProps) {
  return (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}>
      {children}
    </p>
  );
}

export function Blockquote({ className, children }: HeadingProps) {
  return (
    <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)}>
      {children}
    </blockquote>
  );
}

export function List({ className, children }: HeadingProps) {
  return (
    <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}>
      {children}
    </ul>
  );
}

export function InlineCode({ className, children }: HeadingProps) {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className
      )}
    >
      {children}
    </code>
  );
}

export function Lead({ className, children }: HeadingProps) {
  return (
    <p className={cn("text-xl text-muted-foreground", className)}>{children}</p>
  );
}

export function Large({ className, children }: HeadingProps) {
  return (
    <span className={cn("text-lg font-semibold", className)}>{children}</span>
  );
}

export function Small({ className, children }: HeadingProps) {
  return (
    <small className={cn("text-sm font-medium leading-none", className)}>
      {children}
    </small>
  );
}

export function Muted({ className, children }: HeadingProps) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
  );
}
