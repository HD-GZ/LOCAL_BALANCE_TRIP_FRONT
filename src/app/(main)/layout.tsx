import Header from "@/components/layout/header"
export default function PropensityLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      {children}
    </div>
  );
}