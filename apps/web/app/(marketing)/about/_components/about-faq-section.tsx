"use client";

import { AnimatedList, AnimatedListItem } from "@/components/magicui/animated-list";
import { BlurFade } from "@/components/magicui/blur-fade";

const FAQ_ITEMS = [
  {
    question: "로그인 없이 쓸 수 있나요?",
    answer:
      "네. 처음 방문하면 게스트로 시작해요. 오늘의 질문, 서랍, 타임캡슐 등 대부분의 기능을 로그인 없이 이용할 수 있어요.",
  },
  {
    question: "하루에 이야기를 여러 개 쓸 수 있나요?",
    answer:
      "같은 날, 같은 질문에는 이야기를 하나만 남길 수 있어요. 질문이 주어진 그날에만 새로 작성할 수 있고, 날짜가 지나면 새로 쓰지 못해요. 이미 남긴 이야기는 수정하거나 삭제할 수 있어요.",
  },
  {
    question: "Echo(1년 후 비교)는 무엇인가요?",
    answer:
      "365개 질문이 날짜마다 하나씩 배정돼요. 1년 뒤 같은 날짜에 같은 질문을 다시 받으면 Echo예요. 그때 쓴 이야기와 지금의 이야기를 비교하며 나 자신을 돌아볼 수 있어요.",
  },
  {
    question: "공개 글은 어떻게 올리나요?",
    answer:
      "이야기 작성 시 [커뮤니티 공개]를 선택하면 공개 이야기 목록에 노출돼요. 공개 저장과 댓글 작성에는 이메일 인증이 필요해요.",
  },
  {
    question: "문의는 어디로 하면 되나요?",
    answer:
      "아래 정책·문의 링크에서 이메일이나 오픈카톡으로 연락해 주세요. 궁금한 점이나 의견을 보내 주시면 감사해요.",
  },
];

export function AboutFaqSection() {
  return (
    <BlurFade delay={0.24} inView className="space-y-3">
      <h3 className="text-lg font-semibold text-ink">자주 묻는 질문</h3>
      <AnimatedList className="gap-3">
        {FAQ_ITEMS.map((item) => (
          <AnimatedListItem key={item.question}>
            <div className="rounded-xl border border-hairline bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-ink">{item.question}</p>
              <p className="mt-2 text-sm leading-relaxed text-charcoal">{item.answer}</p>
            </div>
          </AnimatedListItem>
        ))}
      </AnimatedList>
    </BlurFade>
  );
}
