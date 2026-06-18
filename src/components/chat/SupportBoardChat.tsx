"use client";

import { useEffect } from "react";

/**
 * Support Board live-chat widget (mounted bottom-left).
 *
 * Backend: https://app.wakame.ma/support-board (self-hosted standalone).
 *
 * main.js auto-detects its own URL from its <script src=> and uses
 * SBF.cors() to fetch /include/init.php (which has CORS allow-origin:*
 * since we set SB_CROSS_DOMAIN=true). It then injects the chat HTML
 * into <body> and wires up handlers. We only need to:
 *   1. Load jQuery first (main.js is wrapped in `(function($){...}(jQuery))`)
 *   2. Load main.js with its real URL so URL auto-detection works
 *   3. Load the stylesheet
 *
 * Do NOT also fetch init.php ourselves — main.js will, and a second
 * copy would duplicate the widget.
 */
const SB_URL = "https://app.wakame.ma/support-board";

export function SupportBoardChat() {
  useEffect(() => {
    if (document.querySelector('script[data-sb-main="1"]')) return;

    // Stylesheet
    if (!document.querySelector('link[data-sb-css="1"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `${SB_URL}/css/main.css?v=3.9.0`;
      link.dataset.sbCss = "1";
      document.head.appendChild(link);
    }

    function loadScript(src: string, dataAttr: string): Promise<void> {
      return new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.async = false;
        s.setAttribute(dataAttr, "1");
        s.onload = () => resolve();
        s.onerror = (e) => reject(e);
        document.head.appendChild(s);
      });
    }

    (async () => {
      try {
        // jQuery first — only if not already on the page
        if (
          typeof (window as unknown as { jQuery?: unknown }).jQuery ===
          "undefined"
        ) {
          await loadScript(
            "https://code.jquery.com/jquery-3.7.1.min.js",
            "data-sb-jquery"
          );
        }
        // main.js — its src tells it where to find /include/init.php
        await loadScript(`${SB_URL}/js/main.js?v=3.9.0`, "data-sb-main");
      } catch (e) {
        console.error("[SupportBoard] load failed:", e);
      }
    })();
  }, []);

  return null;
}
