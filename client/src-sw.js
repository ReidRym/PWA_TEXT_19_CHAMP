const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
// const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');
const { precacheAndRoute } = require('workbox-precaching');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html','/'],
  strategy: pageCache,
});

registerRoute(
  ({ request }) => request.mode === 'navigate',
  pageCache
);

// Set up asset cache
const assetCache = new CacheFirst({
  cacheName: 'asset-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxEntries: 60,
      maxAgeSeconds: 4 * 24 * 60 * 60, //4 days 
    }),
  ],
});

warmStrategyCache({
  urls: ['/assets/*.*'],
  strategy: assetCache,
});

registerRoute(
  // These will filter out all requests that do not match one of these destination types
  ({ request }) => ['image', 'script', 'style', 'font'].includes(request.destination),
  assetCache
);
//   new StaleWhileRevalidate({
//     cacheName: 'asset-cache',
//     plugins: [
//       new CacheableResponsePlugin({
//         statuses: [0, 200],
//       }),
//     ],
//   })
// );

offlineFallback({
  cacheName: 'assets-defined',
  strategies: [assetCache],
});
