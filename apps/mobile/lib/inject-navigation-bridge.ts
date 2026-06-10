export function buildNavigationBridgeScript(): string {
  return `
    (function() {
      if (window.__storyechoNavigationBridgeInstalled) return;
      window.__storyechoNavigationBridgeInstalled = true;

      document.documentElement.dataset.native = '1';

      function postNavigation() {
        if (!window.ReactNativeWebView) return;
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'navigation',
          pathname: window.location.pathname,
          canGoBack: false
        }));
      }

      function wrap(fn) {
        return function wrapper() {
          var res = fn.apply(this, arguments);
          postNavigation();
          return res;
        };
      }

      history.pushState = wrap(history.pushState);
      history.replaceState = wrap(history.replaceState);
      window.addEventListener('popstate', postNavigation);

      if (typeof window.__storyechoNavigateBack !== 'function') {
        window.__storyechoNavigateBack = function() {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'back-result',
              handled: false
            }));
          }
          return false;
        };
      }

      postNavigation();

      function postDeviceId() {
        if (!window.ReactNativeWebView) return;
        var deviceId = window.localStorage.getItem('storyecho_device_id');
        if (!deviceId) return;
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'device-id',
          deviceId: deviceId
        }));
      }

      postDeviceId();
      window.addEventListener('storage', postDeviceId);
      window.addEventListener('storyecho-device-id-ready', postDeviceId);
      window.__storyechoPostDeviceId = postDeviceId;
      setInterval(postDeviceId, 2000);
    })();
    true;
  `;
}
