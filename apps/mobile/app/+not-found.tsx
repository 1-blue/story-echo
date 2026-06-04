import { router } from "expo-router";
import { AppScreen, AppScreenButton } from "@/components/AppScreen";

export default function NotFoundScreen() {
  return (
    <AppScreen
      title="페이지를 찾을 수 없어요"
      body="요청하신 화면이 없거나 이동되었을 수 있어요."
      action={<AppScreenButton label="홈으로" onPress={() => router.replace("/")} />}
    />
  );
}
