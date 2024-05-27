import { H1, H3 } from "../ui/Typography";

const Dashboard = () => {
  return (
    <div className="flex justify-center items-center flex-col gap-2 min-h-[60vh]">
      <H1>Welcome</H1>
      <H3>
        This is the dashboard, it can be used to see the business insights.
      </H3>
    </div>
  );
};

export default Dashboard;
