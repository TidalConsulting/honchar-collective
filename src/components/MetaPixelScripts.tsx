"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * The Meta pixel.
 *
 * Mounted from the public site layout only, so it never runs inside the staff
 * dashboard — staff editing inventory shouldn't look like a shopper. The server
 * component that wraps this also holds it to production, so preview builds
 * don't teach Meta to chase the wrong audience.
 */
export function MetaPixelScripts({ id }: { id: string }) {
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', ${JSON.stringify(id)});
fbq('track', 'PageView');`}
      </Script>

      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${encodeURIComponent(id)}&ev=PageView&noscript=1`}
        />
      </noscript>

      <RouteChangePageViews />
    </>
  );
}

/**
 * The snippet above fires PageView once, when the script loads. This is a
 * single-page app, so moving from the shop to a listing never reloads
 * the page and would otherwise go uncounted — most of a visit would vanish.
 */
function RouteChangePageViews() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      // The init snippet already sent one for this page.
      first.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return null;
}
