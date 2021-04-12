const cacheName = "v1";

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('caches.open(cacheName) :>> ');
      return cache.addAll([
        '/index.html',
        '/second.html',
        '/style.css',
        '/app.js',
        '/image-list.js',
        '/star-wars-logo.jpg',
        '/gallery/bountyHunters.jpg',
        '/gallery/myLittleVader.jpg',
        '/gallery/snowTroopers.jpg'
      ])
      .catch(function(error) {
        console.log('cache.addAll :>> ', error);
      });
    })
  );
});

self.addEventListener('fetch', function(event) {
  const requestClone = event.request.clone();
  console.log(">> In addEventListener fetching  >> ", requestClone);
  event.respondWith(caches.match(requestClone).then(function(response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();
        
        caches.open(cacheName).then(function (cache) {
          cache.put(event.request, responseClone);
        }).catch((error) => {
          console.log(`fetch event listener - caches.open(${cacheName}). :>> ${error}`);
        })
        return response;
      }).catch(function () {
        return caches.match('/sw-test/gallery/myLittleVader.jpg');
      });
    }
  }));
});
