/**
 * Working out where a visitor came from.
 *
 * Runs in the browser from two things the page already knows: the referring
 * site and any campaign tags on the URL. No cookies, no IP lookup, no
 * fingerprinting — the same standard the rest of the tracking holds to.
 *
 * Only the referrer's *host* is ever kept. A full referrer URL can carry the
 * search terms someone typed, or another site's query string, and none of that
 * is needed to answer "is Facebook working better than Google?".
 */

export const DIRECT = "Direct";
export const UNKNOWN = "Other";

export type Attribution = {
  source: string;
  referrerHost: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
};

const SEARCH_HOSTS: [RegExp, string][] = [
  [/(^|\.)google\./, "Google"],
  [/(^|\.)bing\./, "Bing"],
  [/(^|\.)duckduckgo\./, "DuckDuckGo"],
  [/(^|\.)search\.yahoo\./, "Yahoo"],
  [/(^|\.)ecosia\./, "Ecosia"],
  [/(^|\.)brave\./, "Brave Search"],
];

const SOCIAL_HOSTS: [RegExp, string][] = [
  [/(^|\.)facebook\.|(^|\.)fb\./, "Facebook"],
  [/(^|\.)instagram\./, "Instagram"],
  [/(^|\.)l\.messenger\./, "Facebook"],
  [/(^|\.)youtube\.|(^|\.)youtu\.be/, "YouTube"],
  [/(^|\.)linkedin\.|(^|\.)lnkd\./, "LinkedIn"],
  [/(^|\.)reddit\./, "Reddit"],
  [/(^|\.)nextdoor\./, "Nextdoor"],
  [/(^|\.)craigslist\./, "Craigslist"],
  [/(^|\.)tiktok\./, "TikTok"],
  [/(^|\.)x\.com|(^|\.)twitter\./, "X"],
];

const UTM_SOURCE_LABEL: Record<string, string> = {
  fb: "Facebook",
  facebook: "Facebook",
  ig: "Instagram",
  instagram: "Instagram",
  google: "Google",
  bing: "Bing",
  email: "Email",
  newsletter: "Email",
};

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function match(host: string, table: [RegExp, string][]) {
  for (const [pattern, label] of table) if (pattern.test(host)) return label;
  return null;
}

/**
 * A paid click is worth separating from a free one — the whole reason to look
 * at this is deciding where the ad money should go.
 */
function isPaid(medium: string | null, params: URLSearchParams) {
  if (params.has("gclid") || params.has("wbraid") || params.has("gbraid")) return true;
  return medium !== null && /^(cpc|ppc|paid|ads?|display|retargeting)$/i.test(medium);
}

export function classify(referrer: string, url: string, ownHost: string): Attribution {
  let params: URLSearchParams;
  try {
    params = new URL(url).searchParams;
  } catch {
    params = new URLSearchParams();
  }

  const clean = (key: string) => {
    const value = params.get(key)?.trim().slice(0, 100);
    return value ? value : null;
  };

  const utmSource = clean("utm_source");
  const utmMedium = clean("utm_medium");
  const utmCampaign = clean("utm_campaign");

  let referrerHost: string | null = null;
  try {
    if (referrer) {
      const host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
      // A link from one page of this site to another isn't a traffic source.
      if (host && host !== ownHost.toLowerCase().replace(/^www\./, "")) referrerHost = host;
    }
  } catch {
    referrerHost = null;
  }

  const paid = isPaid(utmMedium, params);

  // Explicit campaign tags win: they're what the person running the ad set.
  if (utmSource) {
    const label = UTM_SOURCE_LABEL[utmSource.toLowerCase()] ?? titleCase(utmSource);
    return {
      source: paid ? `${label} Ads` : label,
      referrerHost,
      utmSource,
      utmMedium,
      utmCampaign,
    };
  }

  // Click ids, for ads that land without utm tags.
  if (params.has("gclid") || params.has("wbraid") || params.has("gbraid")) {
    return { source: "Google Ads", referrerHost, utmSource, utmMedium, utmCampaign };
  }
  if (params.has("fbclid")) {
    return { source: "Facebook Ads", referrerHost, utmSource, utmMedium, utmCampaign };
  }
  if (params.has("ttclid")) {
    return { source: "TikTok Ads", referrerHost, utmSource, utmMedium, utmCampaign };
  }
  if (params.has("msclkid")) {
    return { source: "Bing Ads", referrerHost, utmSource, utmMedium, utmCampaign };
  }

  if (!referrerHost) {
    return { source: DIRECT, referrerHost, utmSource, utmMedium, utmCampaign };
  }

  const search = match(referrerHost, SEARCH_HOSTS);
  if (search) {
    return {
      source: `${search} (organic)`,
      referrerHost,
      utmSource,
      utmMedium,
      utmCampaign,
    };
  }

  const social = match(referrerHost, SOCIAL_HOSTS);
  if (social) {
    return { source: social, referrerHost, utmSource, utmMedium, utmCampaign };
  }

  return { source: referrerHost, referrerHost, utmSource, utmMedium, utmCampaign };
}
