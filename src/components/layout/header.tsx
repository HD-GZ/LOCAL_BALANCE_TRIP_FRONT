"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ChevronDown from "@/assets/chevronDown.svg";
import Logo from "@/assets/logo.svg";
import { logout } from "@/features/auth/api";
import { userQueries, userQueryKeys } from "@/features/user/queries";
import { cn } from "@/lib/utils";

const NAV_LIST = [
  { name: "홈", path: "/", href: "/" },
  { name: "취향 진단", path: "/propensity", href: "/propensity?step=1" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useQuery(userQueries.me());
  const isHome = pathname === "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setIsMenuOpen(false);
      queryClient.removeQueries({ queryKey: userQueryKeys.me() });
      router.push("/");
    },
  });

  const navLinkClassName = "text-[#5F5B53] text-[14px]";

  useEffect(() => {
    if (!isMenuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

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
        {!isHome && (
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
        )}
      </section>
      <section className="flex items-center">
        <div className="relative" ref={menuRef}>
          <div
            className="flex cursor-pointer items-center gap-2.25 rounded-[100px] border border-[#EBE7DF] px-2.75 py-1.25"
            onClick={() => {
              setIsMenuOpen((prev) => !prev);
            }}
          >
            <span className="text-[13.5px] font-medium">{user?.name}</span>
            <ChevronDown className="size-3.5" />
          </div>
          {isMenuOpen && (
            <div className="absolute top-full right-0 flex w-53 flex-col items-start gap-0.5 rounded-[13px] border border-[#EBE7DF] bg-white p-1.75 shadow-[0_8px_28px_-8px_rgba(40,36,28,0.22)]">
              <div className="flex flex-col items-start gap-0.75 self-stretch rounded-[8px] px-2.75 pt-2.25 pb-2.75">
                <span className="text-[14px] text-[#222019]">{user?.name}님</span>
                <span className="text-[12px] text-[#928D84]">{user?.email}</span>
              </div>
              <span className="h-px w-full bg-[#EBE7DF]" />
              <button className="flex cursor-pointer items-center self-stretch rounded-[8px] px-2.75 py-2.25 hover:bg-gray-100">
                <span className="text-[14px] text-[#222019]">마이페이지</span>
              </button>
              <span className="h-px w-full bg-[#EBE7DF]" />
              <button
                className="flex cursor-pointer items-center self-stretch rounded-[8px] px-2.75 py-2.25 hover:bg-gray-100"
                onClick={() => logoutMutation.mutate()}
              >
                <span className="text-[14px] text-[#B5654A]">
                  {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
                </span>
              </button>
            </div>
          )}
        </div>
      </section>
    </header>
  );
}
