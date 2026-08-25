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
    // 1열로 되돌렸다. 축이 5개(홀수)라 2열에서는 마지막 칸이 비어 어색했다.
    <ol className="divide-line flex w-full flex-col divide-y">
      {questions.map((question) => {
        const [minOption, maxOption] = question.options;
        const score = answers[question.id] ?? 0;

        if (!minOption || !maxOption) {
          return null;
        }

        return (
          <li key={question.id} className="flex min-w-0 flex-col gap-3 py-6 first:pt-0 last:pb-0">
            <p className="text-ink-3 text-cap font-normal">
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
