import { handleRequest, handleOptions } from "./handlers";

addEventListener("fetch", (event: FetchEvent) => {
  const request = event.request;

  if (request.method === "OPTIONS") {
    // Handle CORS preflight requests
    event.respondWith(handleOptions(request));
  } else if (
    request.method === "GET" ||
    request.method === "HEAD" ||
    request.method === "POST"
  ) {
    event.respondWith(handleRequest(event));
  } else {
    const response = new Response(null, {
      status: 405,
      statusText: "Method Not Allowed",
    });

    event.respondWith(response);
  }
});
