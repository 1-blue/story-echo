type PushPlatform = "ios" | "android";

export function buildRegisterPushTokenScript(
  expoPushToken: string,
  platform: PushPlatform,
): string {
  const body = JSON.stringify({ expoPushToken, platform });
  return `
    (function() {
      var deviceId = window.localStorage.getItem('storyecho_device_id');
      var headers = { 'Content-Type': 'application/json' };
      if (deviceId) headers['X-Device-Id'] = deviceId;
      return fetch('/api/v1/users/me/push-token', {
        method: 'PUT',
        credentials: 'include',
        headers: headers,
        body: ${JSON.stringify(body)},
      });
    })();
    true;
  `;
}

export function buildSetNotificationsEnabledScript(enabled: boolean): string {
  return `
    (function() {
      var deviceId = window.localStorage.getItem('storyecho_device_id');
      var headers = { 'Content-Type': 'application/json' };
      if (deviceId) headers['X-Device-Id'] = deviceId;
      return fetch('/api/v1/users/me', {
        method: 'PATCH',
        credentials: 'include',
        headers: headers,
        body: JSON.stringify({ notificationsEnabled: ${enabled ? "true" : "false"} }),
      });
    })();
    true;
  `;
}

export function buildUnregisterPushTokenScript(): string {
  return `
    (function() {
      var deviceId = window.localStorage.getItem('storyecho_device_id');
      var headers = { 'Content-Type': 'application/json' };
      if (deviceId) headers['X-Device-Id'] = deviceId;
      return fetch('/api/v1/users/me/push-token', {
        method: 'DELETE',
        credentials: 'include',
        headers: headers,
      });
    })();
    true;
  `;
}
