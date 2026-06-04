import { ErrorPage } from "@/components/errors/error-page";

export default function AppNotFound() {
  return (
    <ErrorPage
      title="페이지를 찾을 수 없어요"
      description="이동하려는 화면이 없거나 주소가 잘못되었을 수 있어요."
      primaryHref="/app"
      primaryLabel="오늘의 질문"
      secondaryHref="/app/drawer"
      secondaryLabel="서랍으로"
    />
  );
}
