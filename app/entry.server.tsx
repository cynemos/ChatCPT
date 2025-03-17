/**
 * This entry point is used when building in server mode. The resulting file
 * should be deployed to your server, usually as `server/index.js`.
 *
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: any
) {
  return new Promise((resolve, reject) => {
    try {
      let markup = renderToString(
        <RemixServer
          context={remixContext}
          url={request.url}
        />
      );

      resolve(new Response(markup, {
        status: responseStatusCode,
        headers: {
          ...Object.fromEntries(responseHeaders),
          "Content-Type": "text/html",
        },
      }));
    } catch (error) {
      reject(error);
    }
  });
}
