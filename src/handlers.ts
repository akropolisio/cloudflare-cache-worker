export async function handleRequest(event: FetchEvent) {
  const request = event.request;

  const url = getParameterByName(new URL(request.url), "url");

  if (url != null) {
    const cacheUrl = new URL(url);

    // Construct the cache key from the cache URL
    const cacheKey = new Request(cacheUrl.toString(), request);
    const cache = caches.default;

    // Check whether the value is already available in the cache
    // if not, you will need to fetch it from origin, and store it in the cache
    // for future access
    let response = await cache.match(cacheKey);

    if (!response) {
      // If not in cache, get it from origin
      response = await fetch(cacheUrl.toString());

      // Must use Response constructor to inherit all of response's fields
      response = new Response(response.body, response);

      // Cache API respects Cache-Control headers. Setting s-max-age to 400
      // will limit the response to be in cache for 10 seconds max

      // Any changes made to the response here will be reflected in the cached value
      response.headers.append("Cache-Control", "s-maxage=400");

      // Store the fetched response as cacheKey
      // Use waitUntil so you can return the response without blocking on
      // writing to cache
      event.waitUntil(cache.put(cacheKey, response.clone()));
    }
    return response;
  } else {
    return new Response("Incorrect URL", {
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      status: 404,
    });
  }
}

// Function to parse query strings
function getParameterByName(url: URL, name: string): string | null {
  name = name.replace(/[\[\]]/g, "\\$&");
  name = name.replace(/\//g, "");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url.toString());

  if (!results) return null;
  else if (!results[2]) return "";
  else if (results[2]) {
    results[2] = results[2].replace(/\//g, "");
  }

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
