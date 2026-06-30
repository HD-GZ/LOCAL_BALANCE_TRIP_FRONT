"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Bell from "@/assets/bell.svg";
import ChevronDown from "@/assets/chevronDown.svg";
import Logo from "@/assets/logo.svg";
import { cn } from "@/lib/utils";

export default function Header() {
  const NAV_LIST = [
    { name: "홈", path: "/" },
    { name: "취향 진단", path: "/propensity" },
    { name: "추천 코스", path: "/courses" },
    { name: "혜택 안내", path: "/benefits" },
    { name: "내 여행", path: "/my-trips" },
  ];
  const navLinkClassName = "text-[#5F5B53] text-[14px]";
  const pathname = usePathname();
  return (
    <header className="flex h-16.5 w-full items-center justify-between bg-white px-9.5">
      <section className="flex gap-8">
        <div className="flex h-full items-center gap-2.5">
          <Logo className="h-6 w-6" />
          <div className="text-[16.5px] font-semibold">
            <span>로컬</span>
            <span className="text-[#2F6F4F]">밸런스</span>
            <span> 트립</span>
          </div>
        </div>
        <div className="flex gap-6">
          {NAV_LIST.map((item) => (
            <Link
              href={item.path}
              key={item.path}
              type="button"
              className={cn(
                navLinkClassName,
                pathname == item.path ? "font-semibold text-black" : "font-normal",
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </section>
      <section className="flex items-center gap-4.5">
        <div className="flex size-9.5 items-center justify-center rounded-[10px] border border-[#EBE7DF]">
          <Bell className="size-4.75" />
        </div>
        <div className="flex items-center gap-2.25 rounded-[100px] border border-[#EBE7DF] py-2.5 pr-2.75 pl-2.5 cursor-pointer">
          <div className="flex size-7.5 items-center justify-center rounded-full border border-[#C4DDCD] bg-[#E7F0EA] text-[13px] font-semibold text-[#2F6F4F]">
            홍
          </div>
          <span className="text-[13.5px] font-medium">홍길동</span>
          <ChevronDown className="size-3.5" />
        </div>
      </section>
    </header>
  );
}
