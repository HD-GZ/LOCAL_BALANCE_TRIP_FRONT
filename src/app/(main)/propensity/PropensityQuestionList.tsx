"use client";

import { AxisInput } from "@/components/common/Axis";

/**
 * 진단 문항. 각 문항은 하나의 축이다 — 홈 프로필 요약의 축과 같은 형태를 공유한다
 * (DESIGN.md §6 규칙 1).
 *
 * 문항끼리는 괘선으로만 나눈다. 각 문항을 카드에 담으면 카드 안의 카드가 된다.
 */

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
    // 넓은 폭에서는 2열. 축이 5개면 한 열에 쌓을 때보다 한눈에 비교하기 쉽다.
    // 격자에서는 divide-y 가 성립하지 않으므로 구분은 여백이 맡는다.
    <ol className="grid w-full gap-x-12 gap-y-7 lg:grid-cols-2">
      {questions.map((question, index) => {
        const [minOption, maxOption] = question.options;
        const score = answers[question.id] ?? 0;

        if (!minOption || !maxOption) {
          return null;
        }

        return (
          <li key={question.id} className="flex min-w-0 flex-col gap-3">
            <p className="text-ink-3 text-cap flex items-center gap-2 font-normal">
              <span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span>
              <span className="text-ink text-title-3">{question.title}</span>
            </p>
            <AxisInput
              minLabel={minOption.label}
              maxLabel={maxOption.label}
              minHint={minOption.description}
              maxHint={maxOption.description}
              value={score}
              onChange={(value) => onChangeAnswer(question.id, value)}
            />
          </li>
        );
      })}
    </ol>
  );
}
