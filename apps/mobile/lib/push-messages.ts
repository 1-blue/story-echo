export const PUSH_MESSAGE_TYPES = {
  deviceId: "device-id",
  requestNotificationPermission: "request-notification-permission",
  notificationPermissionResult: "notification-permission-result",
  unregisterPush: "unregister-push",
  pushUnregistered: "push-unregistered",
  openAppSettings: "open-app-settings",
} as const;

export type DeviceIdMessage = {
  type: typeof PUSH_MESSAGE_TYPES.deviceId;
  deviceId: string;
};

export type RequestNotificationPermissionMessage = {
  type: typeof PUSH_MESSAGE_TYPES.requestNotificationPermission;
};

export type NotificationPermissionResultMessage = {
  type: typeof PUSH_MESSAGE_TYPES.notificationPermissionResult;
  granted: boolean;
  needsSettings: boolean;
};

export type OpenAppSettingsMessage = {
  type: typeof PUSH_MESSAGE_TYPES.openAppSettings;
};

export type UnregisterPushMessage = {
  type: typeof PUSH_MESSAGE_TYPES.unregisterPush;
};

export type PushUnregisteredMessage = {
  type: typeof PUSH_MESSAGE_TYPES.pushUnregistered;
};

export type PushBridgeMessage =
  | DeviceIdMessage
  | RequestNotificationPermissionMessage
  | NotificationPermissionResultMessage
  | UnregisterPushMessage
  | PushUnregisteredMessage
  | OpenAppSettingsMessage;

export function parsePushBridgeMessage(value: unknown): PushBridgeMessage | null {
  if (typeof value !== "object" || value === null || !("type" in value)) {
    return null;
  }

  const message = value as { type: string };

  switch (message.type) {
    case PUSH_MESSAGE_TYPES.deviceId:
      return typeof (message as DeviceIdMessage).deviceId === "string"
        ? (message as DeviceIdMessage)
        : null;
    case PUSH_MESSAGE_TYPES.requestNotificationPermission:
      return message as RequestNotificationPermissionMessage;
    case PUSH_MESSAGE_TYPES.unregisterPush:
      return message as UnregisterPushMessage;
    case PUSH_MESSAGE_TYPES.openAppSettings:
      return message as OpenAppSettingsMessage;
    default:
      return null;
  }
}
