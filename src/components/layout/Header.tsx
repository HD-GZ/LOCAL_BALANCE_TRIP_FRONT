"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";

import ChevronDown from "@/assets/chevronDown.svg";
import Logo from "@/assets/logo.svg";
import { useNavigationGuard } from "@/contexts/NavigationGuardContext";
import { logout } from "@/features/auth/api";
import { homeQueryKeys } from "@/features/home/queries";
import { userQueries, userQueryKeys } from "@/features/user/queries";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const NAV_LIST = [
  { key: "home", path: "/", href: "/" },
  { key: "propensity", path: "/propensity", href: "/propensity?step=1" },
  { key: "courseRecommend", path: "/course-recommend", href: "/course-recommend?step=1" },
] as const;

function isActive(pathname: string, path: string) {
  return path === "/" ? pathname === "/" : pathname.startsWith(path);
}

export default function Header() {
  const t = useTranslations();
  const pathname = usePathname();
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
      queryClient.removeQueries({ queryKey: userQueryKeys.me() });
      queryClient.removeQueries({ queryKey: homeQueryKeys.all });
      router.push("/");
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
        <nav className="flex min-w-0 items-center gap-6 md:gap-8" aria-label={t("nav.ariaLabel")}>
          <Link
            className="text-ink flex shrink-0 items-center gap-2"
            href="/"
            onNavigate={handleNavigate("/")}
          >
            <Logo className="size-6 shrink-0" />
            <span className="text-title-3 font-display hidden whitespace-nowrap sm:inline">
              <span>{t("brand.prefix")}</span>
              <span className="text-brand-ink">{t("brand.emphasis")}</span>
              <span>{t("brand.suffix")}</span>
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
                    {t(`nav.${item.key}`)}
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
              {t("nav.login")}
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
                    <span className="text-body-sm text-ink font-semibold">
                      {t("nav.greeting", { name: user?.name ?? "" })}
                    </span>
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
                    {t("nav.myPage")}
                  </Link>
                  <button
                    role="menuitem"
                    type="button"
                    className="text-body-sm text-danger-ink hover:bg-danger-wash flex cursor-pointer items-center rounded-xs px-2.5 py-2 font-medium transition-colors duration-(--dur-1) disabled:opacity-45"
                    disabled={logoutMutation.isPending}
                    onClick={() => logoutMutation.mutate()}
                  >
                    {logoutMutation.isPending ? t("nav.logoutPending") : t("nav.logout")}
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
