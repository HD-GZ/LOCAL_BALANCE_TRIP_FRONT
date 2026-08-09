import { cn } from "@/lib/utils";

type HomeSectionStateProps = {
  message: string;
  tone?: "muted" | "error";
};

export default function HomeSectionState({ message, tone = "muted" }: HomeSectionStateProps) {
  return (
    <p
      className={cn(
        "w-full py-10 text-center text-[13px]",
        tone === "error" ? "text-red-500" : "text-[#928D84]",
      )}
    >
      {message}
    </p>
  );
}
