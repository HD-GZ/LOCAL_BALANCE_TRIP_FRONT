/**
 * 원본과 동일하게 링크가 아닌 텍스트로 둔다. 해당 라우트가 아직 없으므로
 * href 를 붙이면 깨진 링크가 된다.
 */
const ITEMS = ["이용약관", "개인정보처리방침", "고객센터"];

export default function Footer() {
  return (
    <footer className="border-line mt-auto w-full border-t">
      <div className="text-ink-3 mx-auto flex w-full max-w-[1280px] flex-col items-center gap-3 px-4 py-8 sm:flex-row sm:justify-between md:px-8">
        <p className="text-cap font-normal">© 2026 로컬밸런스 트립</p>
        <ul className="flex items-center gap-5">
          {ITEMS.map((item) => (
            <li key={item} className="text-cap font-normal">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
