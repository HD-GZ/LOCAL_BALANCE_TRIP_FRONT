import { cn } from "@/lib/utils";

interface QuestionProps {
  questions: {
    id: string;
    title: string;
    options: {
      value: string;
      label: string;
      description: string;
    }[];
  }[];
  answers: Record<string, number>;
  onChangeAnswer: (questionId: string, answerValue: number) => void;
}

export default function PropensityQuestionList({
  questions,
  answers,
  onChangeAnswer,
}: QuestionProps) {
  return (
    <>
      {questions.map((question) => {
        const selectedScore = answers[question.id] ?? 0;
        return (
          <div
            key={question.id}
            className="flex w-full flex-col gap-3.25 border-b border-b-[#EBE7DF]"
          >
            <p className="text-[14.5px] font-semibold text-[#222019]">{question.title}</p>

            <div className="flex justify-between">
              {question.options.map((option, optionIndex) => {
                const isLeftActive = optionIndex === 0 && selectedScore >= 1 && selectedScore <= 2;
                const isRightActive = optionIndex === 1 && selectedScore >= 4 && selectedScore <= 5;
                const isLeftOption = optionIndex === 0;
                const isRightOption = optionIndex === 1;
                return (
                  <div
                    key={option.value}
                    className={cn(
                      "flex flex-col gap-0.5",
                      isLeftOption && "items-start text-left",
                      isRightOption && "items-end text-right",
                    )}
                  >
                    <p className="text-[14px] font-semibold text-[#5F5B53]">{option.label}</p>
                    <p
                      className={cn(
                        "text-[11.5px] text-[#B9B3AA]",
                        (isLeftActive || isRightActive) && "text-[#3C875F]",
                      )}
                    >
                      {option.description}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="relative mb-5 flex h-8.75 w-full max-w-154 items-center justify-between">
              <span className="absolute top-1/2 right-[17.5px] left-[17.5px] h-0.5 -translate-y-1/2 bg-[#D9D5CD]" />
              {[1, 2, 3, 4, 5].map((score) => {
                const isSelected = selectedScore === score;
                return (
                  <button
                    key={score}
                    type="button"
                    onClick={() => onChangeAnswer(question.id, score)}
                    className="relative z-10 flex size-8.75 shrink-0 items-center justify-center"
                  >
                    <span
                      className={cn(
                        "flex items-center justify-center rounded-full border-2 bg-white",
                        score === 3 ? "size-2.25 border-[#D9D5CD]" : "size-3.5 border-[#C3BDB3]",
                        isSelected && "size-8.75 border-[#E7F0EA]",
                      )}
                    >
                      {isSelected && <span className="block size-5.25 rounded-full bg-[#2F6F4F]" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}
