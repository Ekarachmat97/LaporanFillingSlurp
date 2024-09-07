self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('static-cache').then((cache) => {
            return cache.addAll([
                './', // cache the main page
                './styles.css',
                './script.js',
                './manifest.json',
                './https://www.kindairy.com/themes/kindairy/img/slurp/slurp-about.png',
                './https://www.kindairy.com/themes/kindairy/img/slurp/slurp-about.png'
            ]);
        })
    );
    console.log('Service Worker installed');
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
