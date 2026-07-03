"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import ChevronDown from "@/assets/chevronDown.svg";
import Logo from "@/assets/logo.svg";
import { useMeQuery } from "@/features/user/queries";
import { cn } from "@/lib/utils";

export default function Header() {
  const NAV_LIST = [
    { name: "홈", path: "/", href: "/" },
    { name: "취향 진단", path: "/propensity", href: "/propensity?step=1" },
  ];
  const navLinkClassName = "text-[#5F5B53] text-[14px]";
  const pathname = usePathname();
  const { data: user } = useMeQuery();
  const router = useRouter();

  return (
    <header className="flex h-16.5 w-full items-center justify-between bg-white px-9.5">
      <section className="flex gap-8">
        <button className="flex h-full cursor-pointer items-center gap-2.5" onClick={() => {router.push("/")}}>
          <Logo className="h-6 w-6" />
          <div className="text-[16.5px] font-semibold">
            <span>로컬</span>
            <span className="text-[#2F6F4F]">밸런스</span>
            <span> 트립</span>
          </div>
        </button>
        <div className="flex gap-6">
          {NAV_LIST.map((item) => (
            <Link
              href={item.href}
              key={item.path}
              className={cn(
                navLinkClassName,
                pathname === item.path ? "font-semibold text-black" : "font-normal",
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </section>
      <section className="flex items-center">
        <div className="flex cursor-pointer items-center gap-2.25 rounded-[100px] border border-[#EBE7DF] px-2.75 py-1.25">
          <span className="text-[13.5px] font-medium">{user?.name ?? "사용자"}</span>
          <ChevronDown className="size-3.5" />
        </div>
      </section>
    </header>
  );
}
