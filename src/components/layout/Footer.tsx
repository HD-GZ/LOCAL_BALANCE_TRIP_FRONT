import Link from "next/link";

/**
 * 기존 디자인(develop)의 가운데 한 줄 형태로 되돌렸다 — 팀 합의 사항.
 */
const ITEMS: { label: string; href?: string }[] = [
  { label: "이용약관", href: "/policy/terms" },
  { label: "개인정보처리방침", href: "/policy/privacy" },
  { label: "고객센터", href: "mailto:hdgz@lb-trip.live" },
];

export default function Footer() {
  return (
    <footer className="text-ink-3 text-cap mt-auto w-full py-5 text-center font-normal">
      © 2026 로컬밸런스 트립
      {ITEMS.map((item) => (
        <span key={item.label}>
          <span aria-hidden className="px-2">
            ·
          </span>
          {item.href ? (
            <Link href={item.href} className="hover:text-ink-2 transition-colors duration-(--dur-1)">
              {item.label}
            </Link>
          ) : (
            item.label
          )}
        </span>
      ))}
    </footer>
  );
}
