/**
 * Line-art stand-in used wherever an item has no uploaded photo yet.
 *
 * The silhouette follows the category and the fill follows `color`, with the
 * brand set underneath like a boutique display card — so a shipment that's
 * still in boxes, or a listing posted from the US before the photos are done,
 * still reads as a distinct piece in the grid instead of a broken image.
 */

const FILL: [string, string][] = [
  ["monogram", "#5a3d27"],
  ["damier", "#4b3324"],
  ["black", "#141210"],
  ["noir", "#141210"],
  ["white", "#e9e4da"],
  ["ivory", "#e6dcc8"],
  ["cream", "#e6dcc8"],
  ["beige", "#cdb89a"],
  ["tan", "#b08d62"],
  ["camel", "#a67b4b"],
  ["brown", "#5e4030"],
  ["cognac", "#8a4f2a"],
  ["red", "#8f1f24"],
  ["burgundy", "#5e1a24"],
  ["pink", "#d79aa6"],
  ["blue", "#2a3f63"],
  ["navy", "#1d2a44"],
  ["green", "#2e4a37"],
  ["olive", "#545a35"],
  ["grey", "#6f6b66"],
  ["gray", "#6f6b66"],
  ["silver", "#b8b6b2"],
  ["gold", "#b8923a"],
];

function fillFor(color?: string | null) {
  if (color) {
    const needle = color.toLowerCase();
    for (const [key, value] of FILL) if (needle.includes(key)) return value;
  }
  return "#1f1c18";
}

type Props = {
  category: string;
  color?: string | null;
  brand?: string | null;
  className?: string;
};

export function ItemIllustration({ category, color, brand, className }: Props) {
  const fill = fillFor(color);
  const uid = `${category}-${color ?? "x"}`.replace(/[^a-zA-Z0-9]/g, "");

  return (
    <svg
      viewBox="0 0 400 500"
      className={className}
      role="img"
      aria-label={`${brand ? `${brand} ` : ""}${category} illustration`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={`glow-${uid}`} cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="#25211b" />
          <stop offset="100%" stopColor="#0b0a09" />
        </radialGradient>
        <linearGradient id={`sheen-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect x="-400" y="-400" width="1200" height="1300" fill={`url(#glow-${uid})`} />
      <ellipse cx="200" cy="418" rx="150" ry="10" fill="#000000" opacity="0.5" />

      <g
        stroke="#d4a940"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill={fill}
      >
        {shapeFor(category)}
      </g>
      <g fill={`url(#sheen-${uid})`} stroke="none" pointerEvents="none">
        {shapeFor(category)}
      </g>

      {brand && (
        <text
          x="200"
          y="470"
          textAnchor="middle"
          fill="#d4a940"
          opacity="0.85"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 17,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
          }}
        >
          {brand}
        </text>
      )}
    </svg>
  );
}

function shapeFor(category: string) {
  switch (category) {
    case "Handbags":
      return (
        <>
          <path d="M150 215 C150 130 250 130 250 215" fill="none" strokeWidth="7" />
          <path d="M110 212 L290 212 L312 392 Q312 404 300 404 L100 404 Q88 404 88 392 Z" />
          <path d="M110 212 L290 212 L283 282 Q200 306 117 282 Z" />
          <rect x="189" y="278" width="22" height="20" rx="3" fill="#d4a940" />
        </>
      );
    case "Small Leather Goods":
      return (
        <>
          <rect x="95" y="220" width="210" height="150" rx="12" />
          <path d="M95 236 Q200 302 305 236" fill="none" />
          <circle cx="200" cy="272" r="9" fill="#d4a940" />
        </>
      );
    case "Shoes":
      return (
        <>
          <path d="M70 404 C68 388 92 380 130 376 C185 370 225 349 250 304 L300 254 C316 264 320 290 312 309 C262 320 204 384 162 404 Z" />
          <path d="M297 314 L312 309 L307 410 L300 410 Z" fill="#d4a940" />
        </>
      );
    case "Sneakers":
      return (
        <>
          <path d="M72 378 C72 350 92 332 132 327 L204 302 C219 282 234 272 262 270 L302 270 C322 270 332 292 334 322 L337 378 Z" />
          <path d="M66 378 L342 378 Q347 394 332 400 L82 400 Q62 398 66 378 Z" fill="#e9e4da" />
          <path d="M204 302 L222 332 M220 294 L240 324 M237 286 L257 316" fill="none" />
        </>
      );
    case "Watches":
      return (
        <>
          <rect x="166" y="96" width="68" height="104" rx="8" />
          <rect x="166" y="300" width="68" height="104" rx="8" />
          <circle cx="200" cy="250" r="74" />
          <circle cx="200" cy="250" r="58" fill="#0e0d0b" />
          <rect x="272" y="242" width="12" height="16" rx="2" fill="#d4a940" />
          <path d="M200 250 L200 208 M200 250 L231 263" fill="none" strokeWidth="3.5" />
          <circle cx="200" cy="250" r="4" fill="#d4a940" />
        </>
      );
    case "Jewelry":
      return (
        <>
          <circle cx="200" cy="300" r="78" fill="none" strokeWidth="16" stroke="#d4a940" />
          <circle cx="200" cy="300" r="78" fill="none" strokeWidth="2" stroke="#0b0a09" opacity="0.4" />
          <path d="M168 214 L184 190 L216 190 L232 214 L200 250 Z" fill="#e9e4da" />
          <path d="M168 214 L232 214 M184 190 L200 214 L216 190 M200 214 L200 250" fill="none" />
        </>
      );
    case "Ready-to-Wear":
      return (
        <>
          <path d="M172 112 L228 112 L240 172 L216 204 L292 408 L108 408 L184 204 L160 172 Z" />
          <path d="M176 112 L170 84 M224 112 L230 84" fill="none" />
          <path d="M184 204 Q200 214 216 204" fill="none" />
        </>
      );
    case "Outerwear":
      return (
        <>
          <path d="M150 112 L200 138 L250 112 L300 142 L330 304 L300 309 L290 214 L290 410 L110 410 L110 214 L100 309 L70 304 L100 142 Z" />
          <path d="M200 138 L174 232 L200 262 L226 232 Z" fill="#0e0d0b" />
          <circle cx="200" cy="300" r="5" fill="#d4a940" />
          <circle cx="200" cy="340" r="5" fill="#d4a940" />
          <circle cx="200" cy="380" r="5" fill="#d4a940" />
        </>
      );
    case "Sunglasses":
      return (
        <>
          <path d="M82 236 Q80 214 102 214 L178 214 Q192 214 190 230 L184 272 Q178 302 140 302 Q92 302 84 264 Z" />
          <path d="M318 236 Q320 214 298 214 L222 214 Q208 214 210 230 L216 272 Q222 302 260 302 Q308 302 316 264 Z" />
          <path d="M190 226 Q200 214 210 226 M82 226 L58 218 M318 226 L342 218" fill="none" strokeWidth="4" />
        </>
      );
    case "Belts":
      return (
        <>
          <path d="M36 246 L364 246 L364 278 L36 278 Z" />
          <rect x="142" y="218" width="116" height="88" rx="16" fill="#d4a940" />
          <rect x="160" y="236" width="80" height="52" rx="8" fill="#0e0d0b" />
        </>
      );
    default:
      // Accessories, and anything unrecognised: a folded silk scarf.
      return (
        <>
          <path d="M200 140 L304 244 L200 348 L96 244 Z" />
          <path d="M200 166 L278 244 L200 322 L122 244 Z" fill="none" />
          <path d="M184 356 L180 384 M200 352 L200 386 M216 356 L220 384" fill="none" />
        </>
      );
  }
}
