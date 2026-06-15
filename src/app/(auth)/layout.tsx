export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      {children}
      <footer className="py-4 text-center text-[12px] text-[#928D84]">
        © 2026 로컬밸런스
        트립&nbsp;&nbsp;·&nbsp;&nbsp;이용약관&nbsp;&nbsp;·&nbsp;&nbsp;개인정보처리방침&nbsp;&nbsp;·&nbsp;&nbsp;고객센터
      </footer>
    </div>
  );
}
