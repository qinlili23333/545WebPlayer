var APP_PREFIX = '545在线'
var VERSION = '20220501v2'
var VERSION_AZUSA_PATCH_USE = '20220430v2'
var AZUSA_PATCH_SKIP_LIST = [
    './img/bai.png',
    './img/wanan.png',
    './img/大塔.webp',
    './img/wallpaper.webp',
    './img/addlist.svg',
    './img/audiofile.svg',
    './img/broadcast.svg',
    './img/close.svg',
    './img/cover.svg',
    './img/calendar.svg',
    './img/download.svg',
    './img/delete.svg',
    './img/expand.svg',
    './img/exit.svg',
    './img/folder.svg',
    './img/fullscreen.svg',
    './img/loading.svg',
    './img/link.svg',
    './img/menu.svg',
    './img/repeat.svg',
    './img/share.svg',
    './img/sleep.svg',
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
    './manifest.json',
    './toolFrame/cardres/base.png',
    './toolFrame/cardres/fansnum.ttf',
    './toolFrame/audioCutter/',
    './toolFrame/audioCutter/dist/index.js',
    './toolFrame/audioCutter/dist/worker.js',
    './toolFrame/audioCutter/vendor/Mp3LameEncoder.min.js',
    './toolFrame/audioCutter/vendor/Mp3LameEncoder.min.js.mem',
]
var CACHE_NAME = APP_PREFIX + VERSION
var AZUSA_CACHE = APP_PREFIX + VERSION_AZUSA_PATCH_USE
var URLS = [
    './',
    './settings',
    './tools',
    './wallpaper',
    './settingFrame/about',
    './settingFrame/cache',
    './settingFrame/close',
    './settingFrame/import',
    './settingFrame/privacy',
    './settingFrame/quality',
    './settingFrame/source',
    './toolFrame/cardmake'
]
const getCacheName = url => {
    if (url.indexOf("bcebos.com") > 0) {
        return "MusicCache";
    };
    if (url.indexOf("baomitu.com") > 0 || url.indexOf("googleapis.com") > 0 || url.indexOf("gstatic.com") > 0) {
        return "StaticCache";
    };
    if (url.indexOf("hdslb.com") > 0 || url.indexOf("zhimg.com") > 0) {
        return "ImageCache";
    };
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
                    }).catch(error => {
                        console.log("failed to fetch :" + event.request.url)
                        console.log(error);
                    });
                });
            })

        );
    } else {
        event.respondWith(fetch(event.request))
    }
});
self.addEventListener('install', e => {
    self.skipWaiting();
    const install = async () => {
        const cache = await caches.open(CACHE_NAME)
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
        await cache.addAll(AZUSA_PATCH_SKIP_LIST.concat(URLS));
        return true;
    }
    e.waitUntil(install());
});
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            var cacheWhitelist = keyList.filter(key => {
                return key.indexOf(APP_PREFIX)
            })
            cacheWhitelist.push(CACHE_NAME);
            cacheWhitelist.push("MusicCache");
            cacheWhitelist.push("StaticCache");
            cacheWhitelist.push("ImageCache");
            return Promise.all(keyList.map((key, i) => {
                if (cacheWhitelist.indexOf(key) === -1) {
                    console.log('deleting cache : ' + keyList[i])
                    return caches.delete(keyList[i])
                }
            }))
        })
    )
});
self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    console.log(event)
    switch (event.notification.tag) {
        case "直播推送": {
            clients.openWindow("https://live.bilibili.com/545");
            break;
        }
        default: {
            break;
        }
    }
}, false);
