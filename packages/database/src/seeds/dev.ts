import { runProdSeed } from "./prod";

/** dev = prod와 동일한 깨끗한 초기 데이터 (샘플 Story 제외) */
export async function runDevSeed(ctx: Parameters<typeof runProdSeed>[0]) {
  console.warn("[seed] dev 프로필: prod와 동일 (관리자 + 365 질문 + 환영 글)\n");
  await runProdSeed(ctx);
}
