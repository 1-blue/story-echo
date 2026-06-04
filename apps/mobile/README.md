# StoryEcho Mobile (Expo)

웹 앱(`apps/web`) 전체를 **단일 WebView**로 로드하는 Expo shell입니다. 하단 탭·라우팅은 웹 UI가 담당합니다.

## Prerequisites

- Node.js >= 20, pnpm 10
- iOS Simulator / Android Emulator 또는 Expo Go / dev client
- 동일 네트워크에서 접근 가능한 **웹 dev 서버**

## Environment

```bash
cp apps/mobile/.env.example apps/mobile/.env
```

| Variable | Description |
| -------- | ----------- |
| `EXPO_PUBLIC_WEB_URL` | 웹 앱 origin (필수). 예: `http://192.168.0.10:3000` |

**주의:** 실기기/에뮬레이터에서는 `localhost`가 PC를 가리키지 않습니다. PC의 **LAN IP**를 사용하세요.

## Local development

터미널 1 — 웹 (0.0.0.0 바인딩으로 LAN 접근 허용):

```bash
pnpm --filter web dev -- --hostname 0.0.0.0
```

터미널 2 — mobile:

```bash
# apps/mobile/.env 예: EXPO_PUBLIC_WEB_URL=http://192.168.0.10:3000
pnpm --filter mobile dev
```

앱은 `{EXPO_PUBLIC_WEB_URL}/app`으로 진입합니다.

## Features

- **Pull-to-refresh**: iOS `pullToRefreshEnabled`, Android scroll-top 게이트 + `RefreshControl`
- **Android 뒤로가기**: WebView history → 앱 종료
- **iOS 스와이프 뒤로가기**: `allowsBackForwardNavigationGestures`
- **Safe area**: RN inset inject + 웹 `viewport-fit: cover` / CSS variables
- **외부 링크**: `mailto:`, `tel:`, 다른 origin → 시스템 브라우저

## Scripts

| Command | Description |
| ------- | ----------- |
| `pnpm --filter mobile dev` | Expo Go로 Metro 시작 (기본) |
| `pnpm --filter mobile android` | Android 에뮬레이터 + Expo Go |
| `pnpm --filter mobile ios` | iOS 시뮬레이터 + Expo Go |
| `pnpm --filter mobile dev:client` | 커스텀 dev client로 Metro 시작 |
| `pnpm --filter mobile android:run` | dev client 네이티브 빌드·설치 (Android, 최초 1회) |
| `pnpm --filter mobile ios:run` | dev client 네이티브 빌드·설치 (iOS, 최초 1회) |
| `pnpm --filter mobile lint` | TypeScript check |

**Expo Go vs dev client**

- **일반 개발**: `dev` / `android` — Expo Go 앱만 있으면 됩니다 (에뮬레이터·실기기에 Expo Go 설치).
- **dev client** (`expo-dev-client`): `android:run` / `ios:run`으로 `com.storyecho.app`을 한 번 빌드·설치한 뒤 `dev:client`를 사용합니다.

## Troubleshooting

| Issue | Fix |
| ----- | --- |
| `No development build (com.storyecho.app) is installed` | `expo start`가 dev client 모드입니다. Metro에서 `s`로 Expo Go 전환하거나, `pnpm --filter mobile dev`로 다시 시작하세요. dev client가 필요하면 `pnpm --filter mobile android:run` 후 `dev:client` 사용 |
| 빈 화면 / 연결 실패 | `EXPO_PUBLIC_WEB_URL`이 기기에서 ping 가능한지 확인 |
| 하단 탭바 겹침 | 웹 최신 빌드 + 앱 재시작 (safe-area inject) |
| Android 새로고침 안 됨 | 페이지 최상단에서만 당기기 (scroll-at-top) |

EAS Build는 추후 `.md/개발.md` 로드맵 참고.
