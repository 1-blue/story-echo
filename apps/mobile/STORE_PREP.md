# StoryEcho — 스토어 제출 체크리스트 (추후)

Play Store / App Store 제출 전 확인용. 로고·개인정보처리방침 등은 별도 작업 예정.

## 지금 적용됨 (코드)

- 네이티브 UX: 스플래시, 로딩, WebView 오류·재시도, 404, 전역 ErrorBoundary
- Android `targetSdkVersion` / `compileSdkVersion` 35 (`expo-build-properties`)
- iOS `deploymentTarget` 15.1
- EAS `preview` → Android APK (내부 배포)
- WebView 셸 고유 기능 (심사·정책 대응용 설명):
  - Pull-to-refresh (iOS / Android scroll-top)
  - Safe area inject (노치·홈 인디케이터)
  - Android 하드웨어 뒤로가기 (WebView history)
  - iOS 스와이프 뒤로가기
  - 외부 링크·`mailto:`/`tel:` 시스템 처리

## Play Console (추후)

- [ ] 개인정보처리방침 URL (웹 호스팅)
- [ ] Data safety 폼 (수집·공유 데이터)
- [ ] 스토어 listing (제목, 설명, 스크린샷, feature graphic)
- [ ] 콘텐츠 등급 설문
- [ ] 앱 서명 (EAS credentials / Play App Signing)
- [ ] Production AAB 제출 (`eas build --profile production`)
- [ ] 사진 업로드 QA (WebView `<input type="file">` — 권한 제거 후 동작 확인)

## App Store Connect (추후)

- [ ] 개인정보처리방침 URL
- [ ] App Privacy (nutrition labels)
- [ ] 스크린샷·미리보기
- [ ] TestFlight → 심사 제출
- [ ] 4.2 Minimum Functionality — 네이티브 UX·오프라인 에러 화면 설명 준비

## 빌드 명령

```bash
# Preview (내부 테스트)
cd apps/mobile
eas build --profile preview --platform android
eas build --profile preview --platform ios

# Production (스토어 제출용)
eas build --profile production --platform android
eas build --profile production --platform ios
eas submit --platform android
```

## 정책 참고

- [Target API level (Play)](https://support.google.com/googleplay/android-developer/answer/11926878)
- [Functionality & UX (Play)](https://support.google.com/googleplay/android-developer/answer/9898783)
- [WebView / Spam (Play)](https://support.google.com/googleplay/android-developer/answer/9899034)
- [App Store Review Guidelines 4.2](https://developer.apple.com/app-store/review/guidelines/)
