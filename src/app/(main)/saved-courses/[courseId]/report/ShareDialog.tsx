import { X } from "lucide-react";
import Instagram from "@/assets/instagram.svg";
import Kakao from "@/assets/kakao.svg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ShareDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-12.5 flex-1 cursor-pointer text-[15px] font-semibold tracking-[-0.15px]">
          공유하기
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>어디에 공유할까요?</DialogTitle>
        <DialogDescription>지역 소비 금액과 이동 경로는 공유되지 않아요.</DialogDescription>
        <div className="flex w-full items-start gap-2.5 pt-3.75">
          <button
            type="button"
            className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-2.25 rounded-[14px] border border-[#C4DDCD] bg-white py-5"
          >
            <Kakao className="size-6" />
            <span className="text-[13.5px] font-semibold tracking-[-0.135px] text-[#1C4631]">
              카카오톡
            </span>
          </button>
          <button
            type="button"
            className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-2.25 rounded-[14px] border border-[#C4DDCD] bg-white py-5"
          >
            <Instagram className="size-6" />
            <span className="text-[13.5px] font-semibold tracking-[-0.135px] text-[#1C4631]">
              인스타그램 DM
            </span>
          </button>
        </div>
        <DialogClose asChild>
          <button
            type="button"
            aria-label="닫기"
            className="absolute top-4 right-4 flex size-7 cursor-pointer items-center justify-center rounded-full text-[#928D84] hover:text-[#222019]"
          >
            <X className="size-4.5" />
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
