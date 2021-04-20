let GOOGLE_KEY = process.env.GOOGLE_KEY;

export async function handleRequest(event: FetchEvent) {
  const request = event.request;

  const url = getParameterByName(new URL(request.url), "url");

  if (url != null) {
    let cacheUrl = new URL(url);

    if (GOOGLE_KEY !== undefined) {
      cacheUrl.searchParams.set("key", GOOGLE_KEY);
    }

    let json = await DATA.get(cacheUrl.toString());

    if (!json) {
      // If not in cache, get it from origin
      const request = new Request(cacheUrl.toString(), event.request);

      request.headers.set("Origin", new URL(cacheUrl.toString()).origin);

      const response = await fetch(request);

      json = JSON.stringify(await response.json());

      DATA.put(cacheUrl.toString(), json, { expirationTtl: 86400 });
    }

    return new Response(json, {
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      status: 200,
    });
  } else {
    return new Response("Incorrect URL", {
      headers: {
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

export function handleOptions(request: Request) {
  // Make sure the necesssary headers are present
  // for this to be a valid pre-flight request
  if (
    request.headers.get("Origin") !== null &&
    request.headers.get("Access-Control-Request-Method") !== null &&
    request.headers.get("Access-Control-Request-Headers") !== null
  ) {
    // Handle CORS pre-flight request.
    // If you want to check the requested method + headers
    // you can do that here.
    return new Response(null, {
      headers: corsHeaders,
    });
  } else {
    // Handle standard OPTIONS request.
    // If you want to allow other HTTP Methods, you can do that here.
    return new Response(null, {
      headers: {
        Allow: "GET, HEAD, POST, OPTIONS",
      },
    });
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
  "Access-Control-Allow-Headers": "*",
};
