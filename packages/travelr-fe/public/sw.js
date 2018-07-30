importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js',
);

// cache main js file
workbox.routing.registerRoute(
  /.*bundle.*\.js/,
  workbox.strategies.staleWhileRevalidate(),
);

// cache index.html
workbox.routing.registerRoute(/\//, workbox.strategies.staleWhileRevalidate());

// cache online fonts
workbox.routing.registerRoute(
  /.*(fonts\.googleapis\.com|fonts\.gstatic\.com).*/,
  workbox.strategies.staleWhileRevalidate(),
);
