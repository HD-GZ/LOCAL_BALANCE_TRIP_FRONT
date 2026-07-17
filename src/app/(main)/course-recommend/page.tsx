import CourseDestinationList, { type RecommendedDestination } from "./CourseDestinationList";
import CourseRecommendStep from "./CourseRecommendStep";

// TODO: 취향진단 결과 기반 추천 여행지 API 연동 전까지 사용하는 임시 데이터
const MOCK_DESTINATIONS: RecommendedDestination[] = [
  {
    id: "damyang",
    region: "전라남도 담양군",
    description: "방문객이 적어 한적하고, 대숲과 골목 상권이 풍부해 로컬 미식·산책에 잘 맞아요",
  },
  {
    id: "yeongyang",
    region: "경상북도 영양군",
    description: "관광객 발길이 드문 청정 오지 — 느긋한 쉼과 자연 몰입을 선호하는 성향과 맞아요",
  },
  {
    id: "seocheon",
    region: "충청남도 서천군",
    description: "갯벌 생태와 전통시장 노포가 많아 실속형 로컬 미식·생활 체험에 어울려요",
  },
  {
    id: "jeongseon",
    region: "강원특별자치도 정선군",
    description: "폐광·산촌 정취와 걷기 좋은 둘레길이 많아 활동보다 쉼을 우선하는 코스에 맞아요",
  },
  {
    id: "imsil",
    region: "전라북도 임실군",
    description: "치즈마을·소도시 감성과 직접 해보는 생활 체험형 코스가 풍부해요",
  },
];

export default function CourseRecommend() {
  const currentStep = 1;

  return (
    <div className="flex w-full flex-col items-center pb-20">
      <div className="mt-9.5 flex w-170 flex-col items-center gap-6.5">
        <CourseRecommendStep currentStep={currentStep} />
        <div className="flex w-full flex-col items-start gap-2.25">
          <p className="text-[27px] font-semibold tracking-[-0.675px] text-[#222019]">
            성향에 맞는 추천 여행지
          </p>
          <p className="text-[15px] text-[#5F5B53]">
            성향에 꼭 맞는 여행지예요 · 지역을 누르면 맞춤 추천 코스를 볼 수 있어요
          </p>
        </div>
        <CourseDestinationList destinations={MOCK_DESTINATIONS} />
      </div>
    </div>
  );
}
