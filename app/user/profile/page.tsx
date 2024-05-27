import { UserCard } from "@/components/profile/UserCard";

type Props = {};

const Profile = (props: Props) => {
  return (
    <div className="flex justify-center items-center min-h-[50vh] p-2">
      <UserCard />
    </div>
  );
};

export default Profile;
