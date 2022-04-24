var APP_PREFIX = '545在线'
var VERSION = '20220424'
var VERSION_AZUSA_PATCH_USE = '20220423v2'
var AZUSA_PATCH_SKIP_LIST = [
    './img/addlist.svg',
    './img/audiofile.svg',
    './img/bai.png',
    './img/close.svg',
    './img/cover.svg',
    './img/calendar.svg',
    './img/download.svg',
    './img/delete.svg',
    './img/expand.svg',
    './img/exit.svg',
    './img/folder.svg',
    './img/loading.svg',
    './img/link.svg',
    './img/menu.svg',
    './img/repeat.svg',
    './img/share.svg',
    './img/search.svg',
    './img/setting.svg',
    './img/shuffle.svg',
    './img/terminal.svg',
    './img/tool.svg',
    './img/play.svg',
    './img/next.svg',
    './icon.png',
    './icon_mask.png',
    './icon_mono.png',
    './lib/base64.js',
    './lib/long-press.min.js',
    './lib/ogvjs/ogv.js',
    './lib/ogvjs/ogv-decoder-audio-opus-wasm.js',
    './lib/ogvjs/ogv-decoder-audio-opus-wasm.wasm',
    './lib/ogvjs/ogv-demuxer-ogg-wasm.js',
    './lib/ogvjs/ogv-demuxer-ogg-wasm.wasm',
    './lib/ogvjs/ogv-worker-audio.js',
    './public.css',
    './manifest.json'
]
var CACHE_NAME = APP_PREFIX + VERSION
var AZUSA_CACHE = APP_PREFIX + VERSION_AZUSA_PATCH_USE
var URLS = [
    './',
]
const getCacheName = url => {
    if (url.indexOf("bcebos.com") > 0) {
        return "MusicCache";
    }
    if ((url.indexOf("hdslb.com") > 0) || (url.indexOf("zhimg.com") > 0)) {
        return "ImageCache";
    }
    return CACHE_NAME;
}
self.addEventListener('fetch', event => {
    if (event.request.url.indexOf("getVersionWorker") > 0) {
        event.respondWith(new Response(VERSION));
        return;
    }
    if (event.request.method == "GET" && (event.request.url.indexOf("http") == 0) && (event.request.url.indexOf("ForceNoCache") == -1)) {
        event.respondWith(
            caches.open(getCacheName(event.request.url)).then(async cache => {
                return cache.match(event.request).then(response => {
                    return response || fetch(event.request).then(response => {
                        if (response.status < 400) {
                            cache.put(event.request, response.clone());
                            console.log('file cached : ' + event.request.url)
                        }
                        return response;
                    });
                });
            })

        );
    } else {
        event.respondWith(fetch(event.request))
    }
});
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(async cache => {
            console.log('installing cache : ' + CACHE_NAME)
            if ((await caches.has(AZUSA_CACHE))) {
                console.log("Found Old Cache! Azusa Patch Working...");
                caches.open(AZUSA_CACHE).then(oldCache => {
                    AZUSA_PATCH_SKIP_LIST.forEach(async url => {
                        let tempResponse = await oldCache.match(url);
                        if (tempResponse) {
                            console.log("Azusa Success Transfer Old Cache : " + url)
                            cache.put(url, tempResponse);
                        }
                    })
                })
            }
            return cache.addAll(URLS)
        })
    )
    self.skipWaiting();
})
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            var cacheWhitelist = keyList.filter(key => {
                return key.indexOf(APP_PREFIX)
            })
            cacheWhitelist.push(CACHE_NAME);
            cacheWhitelist.push("MusicCache");
            cacheWhitelist.push("ImageCache");
            return Promise.all(keyList.map((key, i) => {
                if (cacheWhitelist.indexOf(key) === -1) {
                    console.log('deleting cache : ' + keyList[i])
                    return caches.delete(keyList[i])
                }
            }))
        })
    )
})
