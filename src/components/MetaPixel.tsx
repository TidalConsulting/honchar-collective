import { MetaPixelScripts } from "@/components/MetaPixelScripts";
import { site } from "@/lib/site";
import { isPublicSite } from "@/lib/url";

/**
 * Gate for the Meta pixel.
 *
 * Public pages only — this is rendered from the (site) layout, and the staff
 * dashboard lives in a separate tree, so a pixel never loads around the admin
 * forms. That also keeps Automatic Advanced Matching away from the staff
 * sign-in fields, since it reads form inputs on whatever page it's on.
 *
 * isPublicSite() holds it to the real production site: ad platforms bid off
 * conversion data, so a pixel firing on a preview URL doesn't just add noise,
 * it trains Meta to spend money chasing the wrong people.
 */
export function MetaPixel() {
  if (!site.metaPixelId || !isPublicSite()) return null;
  return <MetaPixelScripts id={site.metaPixelId} />;
}
