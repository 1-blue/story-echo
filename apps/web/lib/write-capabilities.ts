export type WriteCapabilities = {
  canUseCommunity: boolean;
  isGuest: boolean;
};

export function getCommunityBlockedMessage(capabilities: WriteCapabilities): string {
  if (capabilities.isGuest) {
    return "로그인 후 사용할 수 있습니다.";
  }
  return "이메일 인증 후 오늘 공개하기를 사용할 수 있습니다.";
}
