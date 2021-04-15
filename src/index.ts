import { handleRequest } from "./handlers";

addEventListener("fetch", (event: FetchEvent) => {
  event.respondWith(handleRequest(event));
});
