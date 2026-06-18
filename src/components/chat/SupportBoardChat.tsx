"use client";

import Script from "next/script";

/**
 * Support Board live-chat widget mounted bottom-left.
 *
 * Backend: https://app.wakame.ma/support-board (self-hosted).
 * That endpoint has CORS allow-origin: * (we enabled SB_CROSS_DOMAIN
 * in its config.php), so this Next.js site can talk to it directly.
 *
 * Server-side settings already applied:
 *   chat-position             = left   (widget sits bottom-left)
 *   chat-button-offset-bottom = 90     (clears the mobile bottom nav)
 *   chat-button-offset-side   = 16
 *   front-auto-translations   = fr     (French by default)
 *   admin-title               = Wakame Sushi
 *   bot-name                  = Wakame Assistant
 */
const SB_URL = "https://app.wakame.ma/support-board";

export function SupportBoardChat() {
  return (
    <>
      {/* Inline var must be defined BEFORE main.js reads it. Using an inline
          script with dangerouslySetInnerHTML so it injects synchronously. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.SB_URL = "${SB_URL}";`,
        }}
      />

      {/* Stylesheet — loaded async, no render-block */}
      <link
        rel="stylesheet"
        href={`${SB_URL}/css/main.css?v=3.9.0`}
        crossOrigin="anonymous"
      />

      {/* Widget bundle — lazy so it doesn't slow first paint. main.js
          reads window.SB_URL, fetches init.php for chat HTML, injects
          it into the body, and wires up event handlers. */}
      <Script
        id="sb-main-js"
        src={`${SB_URL}/js/main.js?v=3.9.0`}
        strategy="lazyOnload"
        crossOrigin="anonymous"
      />
    </>
  );
}
