import React from "react";
import { H1, H3 } from "../ui/Typography";

const Home = () => {
  return (
    <div className="flex justify-center items-center flex-col gap-2 min-h-[60vh]">
      <H1>Welcome</H1>
      <H3>
        This is the home page, it can be used to see the business details.
      </H3>
    </div>
  );
};

export default Home;
