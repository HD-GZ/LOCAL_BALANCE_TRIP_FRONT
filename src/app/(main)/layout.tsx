import { Suspense } from "react";
import Header from "@/components/layout/Header";

export default function PropensityLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <Suspense>{children}</Suspense>
    </div>
  );
}
