import { ErrorPage } from "@/components/errors/error-page";

export default function NotFound() {
  return (
    <ErrorPage
      title="페이지를 찾을 수 없어요"
      description="주소가 바뀌었거나 삭제된 페이지일 수 있어요."
      primaryHref="/"
      primaryLabel="시작하기"
      secondaryHref="/app"
      secondaryLabel="앱으로 이동"
    />
  );
}
