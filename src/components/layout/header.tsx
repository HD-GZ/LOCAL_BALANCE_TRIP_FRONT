"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ChevronDown from "@/assets/chevronDown.svg";
import Logo from "@/assets/logo.svg";
import { userQueries } from "@/features/user/queries";
import { cn } from "@/lib/utils";

const NAV_LIST = [
  { name: "홈", path: "/", href: "/" },
  { name: "취향 진단", path: "/propensity", href: "/propensity?step=1" },
];

export default function Header() {
  const pathname = usePathname();
  const { data: user } = useQuery(userQueries.me());

  const navLinkClassName = "text-[#5F5B53] text-[14px]";

  return (
    <header className="flex h-16.5 w-full items-center justify-between bg-white px-9.5">
      <section className="flex gap-8">
        <Link className="flex h-full cursor-pointer items-center gap-2.5" href={"/"}>
          <Logo className="h-6 w-6" />
          <div className="text-[16.5px] font-semibold">
            <span>로컬</span>
            <span className="text-[#2F6F4F]">밸런스</span>
            <span> 트립</span>
          </div>
        </Link>
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
