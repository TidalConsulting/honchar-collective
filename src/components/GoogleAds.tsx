import Script from "next/script";

import { site } from "@/lib/site";
import { isPublicSite } from "@/lib/url";

/**
 * The Google Ads tag (gtag.js).
 *
 * Rendered from the public site layout only, so it never loads inside the
 * staff dashboard — staff editing inventory shouldn't look like a shopper.
 *
 * It's also gated on isPublicSite(), which is false on preview and test
 * deployments. Ad platforms bid off conversion data, so a tag firing on a
 * staging URL doesn't just add noise, it teaches Google to spend money
 * chasing the wrong audience. Real traffic on the real domain only.
 *
 * `afterInteractive` rather than `beforeInteractive`: an ad script is never
 * worth blocking the page render on, and gtag queues anything that happens
 * before it loads.
 */
export function GoogleAds() {
  if (!site.googleAdsId || !isPublicSite()) return null;

  const id = site.googleAdsId;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(id)});`}
      </Script>
    </>
  );
}
