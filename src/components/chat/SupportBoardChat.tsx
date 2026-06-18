"use client";

import { useEffect } from "react";

/**
 * Support Board live-chat widget (mounted bottom-left).
 *
 * Backend: https://app.wakame.ma/support-board (self-hosted standalone).
 *
 * !! IMPORTANT — main.js URL-detection bug workaround !!
 * Support Board's main.js tries to find its own script tag by scanning
 * `document.scripts` for a src containing `/supportboard/js/main.js`
 * (NO HYPHEN — this is hardcoded). Since our folder is `/support-board/`
 * (WITH hyphen), that auto-detection silently fails and main.js never
 * fetches /include/init.php → no chat HTML → no bubble.
 *
 * We fix it two ways:
 *   1. Set `window.SB_INIT_URL` to the exact main.js URL before main.js
 *      loads. main.js checks this first and uses it verbatim.
 *   2. Give the <script> tag id="sbinit" — main.js also picks this up
 *      as a fallback hint.
 */
const SB_URL = "https://app.wakame.ma/support-board";
const SB_MAIN_JS = `${SB_URL}/js/main.js?v=3.9.0`;

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

    // Tell main.js exactly where to find itself — bypass the buggy
    // /supportboard/ vs /support-board/ folder-name detection.
    (window as unknown as { SB_INIT_URL?: string }).SB_INIT_URL = SB_MAIN_JS;

    function loadScript(
      src: string,
      attrs: Record<string, string> = {}
    ): Promise<void> {
      return new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.async = false;
        for (const [k, v] of Object.entries(attrs)) {
          s.setAttribute(k, v);
        }
        s.onload = () => resolve();
        s.onerror = (e) => reject(e);
        document.head.appendChild(s);
      });
    }

    (async () => {
      try {
        // jQuery first (main.js is wrapped in `(function($){...}(jQuery))`)
        if (
          typeof (window as unknown as { jQuery?: unknown }).jQuery ===
          "undefined"
        ) {
          await loadScript("https://code.jquery.com/jquery-3.7.1.min.js", {
            "data-sb-jquery": "1",
          });
        }
        // main.js — id="sbinit" is the fallback URL hint, data-sb-main is
        // our own re-mount guard.
        await loadScript(SB_MAIN_JS, {
          id: "sbinit",
          "data-sb-main": "1",
        });
      } catch (e) {
        console.error("[SupportBoard] load failed:", e);
      }
    })();
  }, []);

  return null;
}
