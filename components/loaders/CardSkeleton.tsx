import React from "react";
import { Skeleton } from "../ui/skeleton";

const CardSkeleton = () => {
  return (
    <div className="md:min-w-[400px] md:min-h-[400px] justify-center flex items-center">
      <div className="flex flex-col space-y-4 my-8">
        <div className="flex gap-2 items-center">
          <Skeleton className="w-[50px] h-[50px] rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[300px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
        </div>
        <Skeleton className="h-[250px] w-[100%] rounded-xl" />
      </div>
    </div>
  );
};

export default CardSkeleton;
