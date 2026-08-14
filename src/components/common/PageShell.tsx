import { cn } from "@/lib/utils";

/** 흐름형이 아닌 일반 표면의 공통 골격 (DESIGN.md §11). */
export default function PageShell({
  title,
  description,
  actions,
  children,
  width = "wide",
}: {
  title: string;
  /** 배열로 주면 각 문장을 한 줄씩 나눠 쓴다. 두 문장이 한 줄로 이어지면 읽기 어렵다. */
  description?: string | string[];
  actions?: React.ReactNode;
  children: React.ReactNode;
  width?: "wide" | "narrow";
}) {
  return (
    <main className="w-full flex-1 pb-20">
      <div
        className={cn(
          "mx-auto flex w-full flex-col gap-8 px-4 pt-10 md:px-8 md:pt-14",
          width === "wide" ? "max-w-[1280px]" : "max-w-[46rem]",
        )}
      >
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div className="flex flex-col gap-2">
            <h1 className="text-title-1 text-ink sm:text-display-2">{title}</h1>
            {description && (
              <div className="text-ink-2 text-body flex max-w-[64ch] flex-col">
                {(Array.isArray(description) ? description : [description]).map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            )}
          </div>
          {actions}
        </div>
        {children}
      </div>
    </main>
  );
}
