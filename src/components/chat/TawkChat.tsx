"use client";

import { useEffect } from "react";
import Script from "next/script";

/**
 * Tawk.to live-chat widget mounted bottom-left.
 *
 * Set these two env vars in Vercel (Project → Settings → Environment Variables):
 *
 *   NEXT_PUBLIC_TAWK_PROPERTY_ID = 6xxxxxxxxxxxxxxxxxxxxxxx
 *   NEXT_PUBLIC_TAWK_WIDGET_ID   = 1xxxxxxxx
 *
 * They come from the embed snippet on https://dashboard.tawk.to/
 *   embed.tawk.to/<PROPERTY_ID>/<WIDGET_ID>
 *
 * If either is missing the component renders nothing — so it stays safe
 * during local dev without keys.
 */
export function TawkChat() {
  const propertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
  const widgetId = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID;

  useEffect(() => {
    if (!propertyId || !widgetId) return;

    // Initialize Tawk_API before the script loads so we can set onLoad
    // handlers and position overrides.
    type TawkAPI = {
      onLoad?: () => void;
      customStyle?: unknown;
    };
    const w = window as unknown as { Tawk_API?: TawkAPI; Tawk_LoadStart?: Date };
    if (!w.Tawk_API) w.Tawk_API = {};

    // Bottom-left positioning, both desktop and mobile.
    // The Tawk.to docs accept these values via customStyle.visibility.
    w.Tawk_API.customStyle = {
      visibility: {
        desktop: {
          position: "bl",
          xOffset: 16,
          yOffset: 16,
        },
        mobile: {
          position: "bl",
          xOffset: 8,
          yOffset: 80, // clears the mobile bottom nav
        },
      },
    };

    w.Tawk_LoadStart = new Date();
  }, [propertyId, widgetId]);

  if (!propertyId || !widgetId) return null;

  return (
    <Script
      id="tawk-to-widget"
      strategy="afterInteractive"
      src={`https://embed.tawk.to/${propertyId}/${widgetId}`}
      crossOrigin="*"
    />
  );
}
