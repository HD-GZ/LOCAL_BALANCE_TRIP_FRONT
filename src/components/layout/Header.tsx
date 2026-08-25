"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import ChevronDown from "@/assets/chevronDown.svg";
import Logo from "@/assets/logo.svg";
import { useNavigationGuard } from "@/contexts/NavigationGuardContext";
import { logout } from "@/features/auth/api";
import { clearPropensityAnswers, clearPropensityResult } from "@/features/propensity/storage";
import { userQueries } from "@/features/user/queries";
import { usePathname as useLocalePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const NAV_LIST = [
  { name: "홈", path: "/", href: "/" },
  { name: "취향 진단", path: "/propensity", href: "/propensity?step=1" },
  { name: "코스 추천", path: "/course-recommend", href: "/course-recommend?step=1" },
];

function isActive(pathname: string, path: string) {
  return path === "/" ? pathname === "/" : pathname.startsWith(path);
}

export default function Header() {
  const pathname = usePathname();
  const localePathname = useLocalePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const meQuery = useQuery(userQueries.me());
  const user = meQuery.data;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { requestNavigate } = useNavigationGuard();
  const reduce = useReducedMotion();

  const handleNavigate = (href: string) => (event: { preventDefault: () => void }) => {
    if (requestNavigate(href)) event.preventDefault();
  };

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setIsMenuOpen(false);
      queryClient.clear();
      clearPropensityAnswers();
      clearPropensityResult();
      // 캐시를 비워도 이미 렌더된 화면(예: 홈의 진단 결과 카드)은 그 자체로는
      // 다시 렌더되지 않아 로그아웃 이전 데이터가 남을 수 있다. router.refresh()로
      // 현재 라우트를 다시 렌더해 확실히 반영한다.
      router.refresh();
      if (localePathname !== "/") {
        router.push("/");
      }
    },
  });

  useEffect(() => {
    if (!isMenuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMenuOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  // 표면은 기존 디자인(흰 배경, 굵은 글씨 활성 표시)으로 되돌렸다 — 팀 합의 사항.
  // 스티키는 유지한다. 장식이 아니라 이동 수단이고, 화면이 길어진 지금
  // 상단으로 돌아가려면 매번 끝까지 스크롤해야 한다.
  return (
    <header className="border-line bg-surface sticky top-0 z-40 w-full border-b">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-4 px-4 md:px-8">
        <nav className="flex min-w-0 items-center gap-6 md:gap-8" aria-label="주요 메뉴">
          <Link
            className="text-ink flex shrink-0 items-center gap-2"
            href="/"
            onNavigate={handleNavigate("/")}
          >
            <Logo className="size-6 shrink-0" />
            <span className="text-title-3 font-display hidden whitespace-nowrap sm:inline">
              <span>로컬</span>
              <span className="text-brand-ink">밸런스</span>
              <span> 트립</span>
            </span>
          </Link>
          <ul className="flex items-center gap-4 md:gap-6">
            {NAV_LIST.map((item) => {
              const active = isActive(pathname, item.path);

              return (
                <li key={item.path}>
                  <Link
                    href={item.href}
                    onNavigate={handleNavigate(item.href)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "text-body-sm block py-1 whitespace-nowrap transition-colors duration-(--dur-1)",
                      active ? "text-ink font-semibold" : "text-ink-2 hover:text-ink font-normal",
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center">
          {!meQuery.isPending && !user && (
            <Link
              href="/login"
              className="press border-line-control text-ink text-body-sm hover:bg-surface-2 flex h-9 items-center rounded-sm border px-3.5 font-semibold"
              onNavigate={handleNavigate("/login")}
            >
              로그인
            </Link>
          )}
          <div className={cn("relative", !user && "hidden")} ref={menuRef}>
            <button
              type="button"
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
              className="press border-line-control hover:bg-surface-2 flex h-9 cursor-pointer items-center gap-2 rounded-sm border px-3"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <span className="text-body-sm text-ink font-semibold">{user?.name}</span>
              <ChevronDown
                className={cn(
                  "size-3 transition-transform duration-(--dur-2)",
                  isMenuOpen && "rotate-180",
                )}
              />
            </button>
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  role="menu"
                  initial={reduce ? undefined : { opacity: 0, y: -4 }}
                  animate={reduce ? undefined : { opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-surface shadow-overlay absolute top-[calc(100%+0.5rem)] right-0 flex w-56 flex-col rounded-md p-1.5"
                >
                  <div className="flex flex-col gap-0.5 px-2.5 pt-2 pb-3">
                    <span className="text-body-sm text-ink font-semibold">{user?.name}님</span>
                    <span className="text-cap text-ink-3 font-normal break-all">{user?.email}</span>
                  </div>
                  <span aria-hidden className="bg-line -mx-1.5 h-px" />
                  <Link
                    role="menuitem"
                    href="/my/account"
                    className="text-body-sm text-ink hover:bg-surface-2 mt-1 flex items-center rounded-xs px-2.5 py-2 font-medium transition-colors duration-(--dur-1)"
                    onClick={() => setIsMenuOpen(false)}
                    onNavigate={handleNavigate("/my/account")}
                  >
                    마이페이지
                  </Link>
                  <button
                    role="menuitem"
                    type="button"
                    className="text-body-sm text-danger-ink hover:bg-danger-wash flex cursor-pointer items-center rounded-xs px-2.5 py-2 font-medium transition-colors duration-(--dur-1) disabled:opacity-45"
                    disabled={logoutMutation.isPending}
                    onClick={() => logoutMutation.mutate()}
                  >
                    {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
