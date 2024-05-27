import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import React from "react";
import { UserAvatar } from "../avatar/Avatar";

type menuItemType = {
  label: string;
  icon: any;
  shortcut?: string;
  link?: string;
  disabled?: boolean;
  subItems?: menuItemType[];
};

const menuItems: menuItemType[] = [
  {
    label: "Profile",
    icon: User,
    // shortcut: "⇧⌘P",
    disabled: false,
    link: "/user/profile",
  },
  {
    label: "Billing",
    icon: CreditCard,
    disabled: true,
    // shortcut: "⌘B",
    link: "/billing",
  },
  {
    label: "Settings",
    icon: Settings,
    disabled: true,
    // shortcut: "⌘S",
    link: "/settings",
  },
  {
    label: "Keyboard shortcuts",
    disabled: true,
    icon: Keyboard,
    // shortcut: "⌘K",
    link: "/keyboard-shortcuts",
  },
  {
    label: "Team",
    disabled: true,
    icon: Users,
    link: "/team",
  },
  {
    label: "Invite users",
    disabled: true,
    icon: UserPlus,
    subItems: [
      {
        label: "Email",
        icon: Mail,
        disabled: true,
        link: "/invite/email",
      },
      {
        label: "Message",
        disabled: true,
        icon: MessageSquare,
        link: "/invite/message",
      },
      {
        label: "More...",
        disabled: true,
        icon: PlusCircle,
        link: "/invite/more",
      },
    ],
  },
  {
    label: "New Team",
    icon: Plus,
    disabled: true,
    // shortcut: "⌘+T",
    link: "/new-team",
  },
  {
    label: "Log out",
    icon: LogOut,
    disabled: false,
    // shortcut: "⇧⌘Q",
    link: "/api/auth/signout",
  },
];

const redButton = buttonVariants({ variant: "destructive" });

export function UserOptions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-fit p-0 rounded-full" variant="secondary">
          <UserAvatar />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            {item.subItems ? (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.label}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {item.subItems.map((subItem, subIndex) => (
                      <DropdownMenuItem
                        disabled={subItem.disabled}
                        asChild
                        key={subIndex}
                      >
                        <Link href={subItem.link ?? ""}>
                          <subItem.icon className="mr-2 h-4 w-4" />
                          <span>{subItem.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            ) : (
              <DropdownMenuItem
                className={
                  item.link === "/api/auth/signout"
                    ? `${redButton} w-full focus-visible:ring-0`
                    : ""
                }
                asChild
                disabled={item.disabled}
                key={index}
              >
                <Link href={item.link ?? ""}>
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.label}</span>
                  {item.shortcut && (
                    <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
                  )}
                </Link>
              </DropdownMenuItem>
            )}
            {(index === 3 || index === 6 || index === 10) && (
              <DropdownMenuSeparator />
            )}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
