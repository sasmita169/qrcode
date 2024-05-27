import { Suspense } from "react";
import Home from "@/components/home/Home";

export default async function HomePage() {
  return (
    <Suspense>
      <main>
        <Home />
      </main>
    </Suspense>
  );
}
