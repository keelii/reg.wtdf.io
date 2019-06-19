__CACHE_VER__ = "fmt.wtdf.io_v1.0.1"
__CACHE_URLS__ = [
    "/",
    "/index.css",
    "/index.js",
    "https://code.bdstatic.com/npm/@wtdf/joshua@0.0.12/dist/joshua.min.css",
    "https://code.bdstatic.com/npm/prettier@1.18.0/standalone.js",
    "https://code.bdstatic.com/npm/prettier@1.18.0/parser-babylon.js",
    "https://code.bdstatic.com/npm/prettier@1.18.0/parser-markdown.js",
    "https://code.bdstatic.com/npm/prettier@1.18.2/parser-html.js",
    "https://code.bdstatic.com/npm/prettier@1.18.2/parser-postcss.js",
    "https://fonts.loli.net/css?family=PT+Serif:400|PT+Serif:400&display=swap",
    "https://fonts.loli.net/css?family=Source+Serif+Pro:400,600,700&display=swap"
]

self.addEventListener('install', function(evt) {
    evt.waitUntil(
        caches.open(__CACHE_VER__).then((cache) => {
            console.log('[ServiceWorker] Pre-caching offline page')
            return cache.addAll(__CACHE_URLS__)
        })
    )
})

self.addEventListener('activate', function(evt) {
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== __CACHE_VER__) {
                    console.log('[ServiceWorker] Removing old cache', key)
                    return caches.delete(key)
                }
            }))
        })
    )
})

self.addEventListener('fetch', function (event) {
    // console.log('[Fetch]', event.request.url)
    event.respondWith(
        caches.match(event.request).then(res => {
            return res ||
                fetch(event.request)
                    .then(responese => {
                        const responeseClone = responese.clone()
                        caches.open(__CACHE_VER__).then(cache => {
                            cache.put(event.request, responeseClone)
                        })
                        return responese
                    })
                    .catch(err => {
                        console.log(err)
                    })
        })
    )
})
