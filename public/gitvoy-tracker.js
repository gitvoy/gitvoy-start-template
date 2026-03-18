(function() {
  const script = document.currentScript;
  const blogId = script?.getAttribute('data-blog-id');
  if (!blogId) return;

  const TRACK_URL = 'https://gitvoy.vercel.app/api/track';

  function getVisitorId() {
    let id = localStorage.getItem('gitvoy_visitor_id');
    if (!id) {
      id = 'v_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
      localStorage.setItem('gitvoy_visitor_id', id);
    }
    return id;
  }

  function track() {
    const data = JSON.stringify({
      blogId: blogId,
      path: window.location.pathname,
      referrer: document.referrer || null,
      visitorId: getVisitorId(),
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(TRACK_URL, new Blob([data], { type: 'application/json' }));
    } else {
      fetch(TRACK_URL, { method: 'POST', body: data, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(function() {});
    }
  }

  if (document.readyState === 'complete') {
    track();
  } else {
    window.addEventListener('load', track);
  }
})();
