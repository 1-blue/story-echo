export function buildNavigationBridgeScript(): string {
  return `
    (function() {
      if (window.__storyechoNavigationBridgeInstalled) return;
      window.__storyechoNavigationBridgeInstalled = true;

      document.documentElement.dataset.native = '1';

      var ROOT_BACK_EXIT_MS = 2000;
      var SHELL_ROOTS = ['/', '/drawer', '/community', '/capsule', '/settings'];

      function normalizePath(pathname) {
        if (pathname.indexOf('/app') === 0) {
          var stripped = pathname.slice(4);
          return stripped.length === 0 ? '/' : stripped;
        }
        return pathname;
      }

      function isShellRoot(pathname) {
        return SHELL_ROOTS.indexOf(normalizePath(pathname)) >= 0;
      }

      function computeCanGoBack(pathname) {
        return !isShellRoot(pathname);
      }

      function getFallbackRoute(pathname) {
        var path = normalizePath(pathname);
        if (isShellRoot(path)) return null;
        if (path.indexOf('/drawer/') === 0) return '/drawer';
        if (path.indexOf('/community/') === 0 && path !== '/community/write') return '/community';
        if (path === '/community/write') return '/community';
        if (path.indexOf('/capsule/') === 0 && path !== '/capsule/write') return '/capsule';
        if (path === '/capsule/write') return '/capsule';
        if (path === '/write') return '/';
        if (path.indexOf('/settings/') === 0) return '/settings';
        if (path === '/notifications') return '/';
        if (path.indexOf('/public/') === 0) return '/';
        return '/';
      }

      function postBackResult(result) {
        if (!window.ReactNativeWebView) return;
        window.ReactNativeWebView.postMessage(JSON.stringify(Object.assign({ type: 'back-result' }, result)));
      }

      function tryCloseAndroidBackOverlays() {
        var openDialog = document.querySelector('[data-state="open"][role="dialog"]');
        if (openDialog) {
          document.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Escape',
            code: 'Escape',
            keyCode: 27,
            bubbles: true
          }));
          return true;
        }
        return false;
      }

      function postNavigation() {
        if (!window.ReactNativeWebView) return;
        var pathname = normalizePath(window.location.pathname);
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'navigation',
          pathname: pathname,
          canGoBack: computeCanGoBack(pathname)
        }));
      }

      window.__storyechoNavigateBack = function() {
        if (tryCloseAndroidBackOverlays()) {
          postBackResult({ handled: true });
          return true;
        }

        var currentPath = normalizePath(window.location.pathname);
        if (!isShellRoot(currentPath)) {
          window.history.back();
          window.setTimeout(function() {
            var nextPath = normalizePath(window.location.pathname);
            if (nextPath === currentPath) {
              var fallback = getFallbackRoute(currentPath);
              if (fallback) window.location.assign(fallback);
            }
          }, 50);
          postBackResult({ handled: true });
          return true;
        }

        var now = Date.now();
        var lastRootBack = window.__storyechoLastRootBack || 0;
        if (now - lastRootBack < ROOT_BACK_EXIT_MS) {
          window.__storyechoLastRootBack = undefined;
          postBackResult({ handled: true, allowExit: true });
          return true;
        }

        window.__storyechoLastRootBack = now;
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'root-back-hint' }));
        }
        postBackResult({ handled: true });
        return true;
      };

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
