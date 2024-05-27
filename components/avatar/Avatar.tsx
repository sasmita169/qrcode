import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

export function UserAvatar() {
  const { data } = useSession();
  const user = data?.user;

  return (
    <Avatar>
      <AvatarImage src={user?.image ?? ""} alt={user?.name ?? "User profile"} />
      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
    </Avatar>
  );
}
