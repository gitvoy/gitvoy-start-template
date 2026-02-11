(function() {
  'use strict';

  // 설정
  var TRACKER_URL = 'https://gitvoy.com/api/track';
  var STORAGE_KEY = 'gitvoy_visitor_id';

  // 방문자 ID 가져오기 또는 생성
  function getVisitorId() {
    var visitorId = localStorage.getItem(STORAGE_KEY);
    if (!visitorId) {
      visitorId = 'v_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEY, visitorId);
    }
    return visitorId;
  }

  // 설정에서 blogId 가져오기
  function getBlogId() {
    var script = document.currentScript || document.querySelector('script[data-blog-id]');
    if (script) {
      return script.getAttribute('data-blog-id');
    }

    // gitvoy-config meta 태그에서 가져오기
    var meta = document.querySelector('meta[name="gitvoy-blog-id"]');
    if (meta) {
      return meta.getAttribute('content');
    }

    return null;
  }

  // 페이지 뷰 전송
  function trackPageView() {
    var blogId = getBlogId();
    if (!blogId) {
      console.warn('[Gitvoy] Blog ID not found. Add data-blog-id attribute to the script tag.');
      return;
    }

    var data = {
      blogId: blogId,
      path: window.location.pathname,
      referrer: document.referrer || null,
      visitorId: getVisitorId()
    };

    // Beacon API 사용 (페이지 떠날 때도 전송 보장)
    if (navigator.sendBeacon) {
      navigator.sendBeacon(TRACKER_URL, JSON.stringify(data));
    } else {
      // 폴백: fetch 사용
      fetch(TRACKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        keepalive: true
      }).catch(function() {
        // 무시
      });
    }
  }

  // 페이지 로드 시 추적
  if (document.readyState === 'complete') {
    trackPageView();
  } else {
    window.addEventListener('load', trackPageView);
  }

  // SPA 네비게이션 지원
  var lastPath = window.location.pathname;
  var observer = new MutationObserver(function() {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      trackPageView();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // History API 후킹
  var originalPushState = history.pushState;
  history.pushState = function() {
    originalPushState.apply(this, arguments);
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      trackPageView();
    }
  };

  var originalReplaceState = history.replaceState;
  history.replaceState = function() {
    originalReplaceState.apply(this, arguments);
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      trackPageView();
    }
  };

  window.addEventListener('popstate', function() {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      trackPageView();
    }
  });
})();
