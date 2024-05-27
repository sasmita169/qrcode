"use client";

import { Check, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { UserAvatar } from "../avatar/Avatar";
import { useState } from "react";

type CardProps = React.ComponentProps<typeof Card>;

export function UserCard({ className, ...props }: CardProps) {
  const { data } = useSession();
  const user = data?.user;

  // Form related
  const [isEdit, setIsEdit] = useState(false);

  // Handlers
  const cancelHandler = () => {
    setIsEdit(false);
  };

  return (
    <Card className={cn("md:w-[380px] shadow-md", className)} {...props}>
      <CardHeader>
        <CardTitle>User Details</CardTitle>
        <CardDescription>Profile information</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-4 rounded-md border p-4">
          <UserAvatar />
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {isEdit ? (
          <div className="flex gap-2 w-full">
            <Button className="w-full">
              <Check className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button
              onClick={cancelHandler}
              className="w-full"
              variant={"secondary"}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex justify-end w-full">
            <Button onClick={() => setIsEdit(true)} className="w-full md:w-1/2">
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
