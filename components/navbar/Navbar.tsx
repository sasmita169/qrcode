"use client";

import * as React from "react";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { UserOptions } from "./UserOptions";
import { ThemeToggle } from "../theme/ThemeToggle";
import { Session } from "next-auth";
import { buttonVariants } from "../ui/button";

const products: { title: string; href: string; description: string }[] = [
  {
    title: "Manage Products",
    href: "/products/manage",
    description: "Manage and organize your products.",
  },
  {
    title: "Manage Product QR",
    href: "/products/generate-qr",
    description: "Manage QR codes for your products.",
  },
  {
    title: "Users",
    href: "/users/manage",
    description:
      "View the list of all your users, manage users, their roles and account status.",
  },
];

export function Navbar() {
  const [session, setSession] = React.useState<Session | null>(null);

  React.useEffect(() => {
    const setUser = async () => {
      const session = await getSession();
      if (session?.user) {
        setSession(session);
      }
    };
    setUser();
  }, []);
  return (
    <div className="flex justify-between p-1 items-center shadow-sm fixed top-0 w-full h-14 backdrop-filter backdrop-blur-md z-50">
      <div>
        <Link className="px-2" href="/">
          Logo
        </Link>
      </div>
      <NavigationMenu>
        <NavigationMenuList className="flex flex-wrap">
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/about" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                About Us
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/contact" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Contact
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 sm:grid-cols-1 md:w-[400px] md:grid-cols-2 lg:w-[600px]">
                {products.map((product) => (
                  <ListItem
                    key={product.title}
                    title={product.title}
                    href={product.href}
                  >
                    {product.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex items-center gap-3 px-2">
        <ThemeToggle />
        {!session?.user ? (
          <Link
            className={buttonVariants({ variant: "ghost" })}
            href={"/api/auth/signin?callbackUrl=/"}
          >
            Login
          </Link>
        ) : (
          <UserOptions />
        )}
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";
