"use client";

import { useEffect, useState } from "react";

/**
 * Support Board live-chat widget mounted bottom-left.
 *
 * Backend: https://app.wakame.ma/support-board (self-hosted standalone).
 *
 * main.js is wrapped in `(function($){ ... }(jQuery))` so jQuery must be
 * available before it runs. main.js then calls init.php itself via AJAX
 * to fetch the chat HTML.
 *
 * We do NOT set `crossOrigin` on the script/link tags — only init.php
 * has CORS headers (we enabled SB_CROSS_DOMAIN), the static js/css assets
 * don't return them. Without `crossOrigin`, browsers load cross-origin
 * scripts the legacy way (no CORS check needed for `<script src>`).
 */
const SB_URL = "https://app.wakame.ma/support-board";

export function SupportBoardChat() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;

    const w = window as unknown as {
      SB_URL?: string;
      SB_AJAX_URL?: string;
      SB_LANG?: string[];
      jQuery?: unknown;
      $?: unknown;
    };

    // Inject the Support Board globals main.js expects to find.
    w.SB_URL = SB_URL;
    w.SB_AJAX_URL = `${SB_URL}/include/ajax.php`;
    w.SB_LANG = ["fr", "front"];

    function loadCss(href: string) {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }

    function loadScript(src: string): Promise<void> {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[data-sb-src="${src}"]`)) {
          resolve();
          return;
        }
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.dataset.sbSrc = src;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(s);
      });
    }

    (async () => {
      // 1. Stylesheet
      loadCss(`${SB_URL}/css/main.css?v=3.9.0`);

      // 2. jQuery if not already on the page
      if (typeof w.jQuery === "undefined") {
        try {
          await loadScript("https://code.jquery.com/jquery-3.7.1.min.js");
        } catch (e) {
          console.error("[SupportBoard] jQuery failed to load", e);
          return;
        }
      }

      // 3. Inject init.php content (it contains the chat HTML + globals)
      try {
        const res = await fetch(`${SB_URL}/include/init.php`, {
          credentials: "omit",
        });
        const html = await res.text();
        const container = document.createElement("div");
        container.id = "sb-init";
        container.style.cssText = "all: initial;";
        container.innerHTML = html;

        // execute any inline <script> tags in the fetched HTML
        const scripts = container.querySelectorAll("script");
        scripts.forEach((oldScript) => {
          const newScript = document.createElement("script");
          if (oldScript.src) newScript.src = oldScript.src;
          else newScript.textContent = oldScript.textContent;
          oldScript.parentNode?.replaceChild(newScript, oldScript);
        });
        document.body.appendChild(container);
      } catch (e) {
        console.error("[SupportBoard] init.php fetch failed", e);
      }

      // 4. main.js
      try {
        await loadScript(`${SB_URL}/js/main.js?v=3.9.0`);
        setLoaded(true);
      } catch (e) {
        console.error("[SupportBoard] main.js failed to load", e);
      }
    })();
  }, [loaded]);

  return null;
}
