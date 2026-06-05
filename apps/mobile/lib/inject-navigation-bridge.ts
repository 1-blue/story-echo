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
          canGoBack: window.history.length > 1
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

      window.__storyechoNavigateBack = function() {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'back-result',
            handled: false
          }));
        }
        return false;
      };

      postNavigation();
    })();
    true;
  `;
}
