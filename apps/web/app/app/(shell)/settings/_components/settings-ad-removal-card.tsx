"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function SettingsAdRemovalCard() {
  return (
    <section className="border-primary/20 bg-primary-soft/40 flex flex-col gap-3 rounded-xl border border-dashed p-4">
      <div>
        <h3 className="text-charcoal text-base font-semibold">광고 제거</h3>
        <p className="text-stone mt-1 text-sm">₩4,900 일회 구매 · 평생 이용</p>
      </div>
      <Button
        variant="outline"
        className="border-primary text-primary hover:bg-primary-soft w-full rounded-full bg-white"
        onClick={() => toast.message("TODO: 광고제거 구현하기")}
      >
        광고 제거하기
      </Button>
    </section>
  );
}
