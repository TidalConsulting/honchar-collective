import { getT } from "@/lib/i18n/server";
import { isPublicSite } from "@/lib/url";

/**
 * Slim marker shown on every non-production deployment, so nobody reviewing
 * the test site mistakes the sample inventory for real stock. Renders nothing
 * on the live site.
 */
export async function PreviewBanner() {
  if (isPublicSite()) return null;
  const { t } = await getT();

  return (
    <div className="bg-gold-500 px-4 py-2 text-center text-sm font-semibold text-black">
      {t.preview}
    </div>
  );
}
