import RouteMarker from "@/assets/routeMarker.svg";

type ThumbImageProps = {
  src: string | null;
  alt: string;
};

export default function ThumbImage({ src, alt }: ThumbImageProps) {
  return (
    <span className="flex size-19 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-[#E2EFE7]">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="size-full object-cover" />
      ) : (
        <RouteMarker className="size-8" />
      )}
    </span>
  );
}
