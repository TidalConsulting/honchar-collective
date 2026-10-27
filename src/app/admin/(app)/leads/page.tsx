import Link from "next/link";

import { deleteLead, updateLeadStatus } from "@/app/actions/admin";
import { formatDateTime, itemTitle } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Leads" };
export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  AVAILABILITY: "Availability",
  LAYAWAY: "Layaway",
  SOURCING: "Sourcing",
  GENERAL: "General",
};

const STATUS_STYLE: Record<string, string> = {
  NEW: "bg-gold-500 text-black",
  CONTACTED: "bg-sky-950/60 text-sky-300",
  CLOSED: "bg-ink-200 text-ink-700",
};

const TABS = [
  { value: "all", label: "All" },
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "CLOSED", label: "Closed" },
] as const;

/** Opens a WhatsApp chat with the customer, greeting already typed. */
function whatsappFor(phone: string, name: string, itemName?: string) {
  const digits = phone.replace(/[^0-9]/g, "");
  const number = digits.length === 10 ? `1${digits}` : digits;
  const first = name.split(/\s+/)[0];
  const text = itemName
    ? `Hola ${first}! This is Honchar Collective about the ${itemName}.`
    : `Hola ${first}! This is Honchar Collective, following up on your message.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : "all";

  const [leads, counts] = await Promise.all([
    prisma.lead.findMany({
      where: ["NEW", "CONTACTED", "CLOSED"].includes(status)
        ? { status: status as "NEW" | "CONTACTED" | "CLOSED" }
        : {},
      orderBy: { createdAt: "desc" },
      take: 200,
      include: {
        item: { select: { slug: true, brand: true, name: true } },
      },
    }),
    prisma.lead.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const countFor = (value: string) =>
    value === "all"
      ? counts.reduce((sum, row) => sum + row._count._all, 0)
      : (counts.find((row) => row.status === value)?._count._all ?? 0);

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink-900 sm:text-4xl">Leads</h1>
      <p className="mt-1 text-ink-600">
        Every enquiry from the website lands here. Mark them as you work through them.
      </p>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {TABS.map((tab) => {
          const active = status === tab.value;
          return (
            <Link
              key={tab.value}
              href={tab.value === "all" ? "/admin/leads" : `/admin/leads?status=${tab.value}`}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active
                  ? "bg-gold-500 text-black"
                  : "border border-ink-300 bg-surface text-ink-700 hover:bg-ink-100"
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-ink-400">{countFor(tab.value)}</span>
            </Link>
          );
        })}
      </div>

      {leads.length === 0 ? (
        <div className="mt-6 rounded-card border border-dashed border-ink-300 bg-surface px-6 py-20 text-center">
          <h2 className="text-lg font-bold text-ink-900">No leads here yet</h2>
          <p className="mt-2 text-ink-600">
            Enquiries from listings, layaway and sourcing requests, and the contact form all show
            up on this screen.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {leads.map((lead) => (
            <li key={lead.id} className="rounded-card border border-ink-200 bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-bold text-ink-900">{lead.name}</h2>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_STYLE[lead.status]}`}>
                      {lead.status === "NEW" ? "New" : lead.status === "CONTACTED" ? "Contacted" : "Closed"}
                    </span>
                    <span className="rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-semibold text-ink-700">
                      {TYPE_LABEL[lead.type]}
                    </span>
                  </div>

                  <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-600">
                    {lead.phone && (
                      <a
                        href={whatsappFor(lead.phone, lead.name, lead.item?.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-ink-900 hover:text-gold-500"
                      >
                        WhatsApp {lead.phone} ↗
                      </a>
                    )}
                    {lead.email && (
                      <a href={`mailto:${lead.email}`} className="font-medium text-ink-900 hover:text-gold-500">
                        {lead.email}
                      </a>
                    )}
                    <span>{formatDateTime(lead.createdAt)}</span>
                  </p>

                  {lead.item && (
                    <p className="mt-2 text-sm">
                      <span className="text-ink-500">About: </span>
                      <Link
                        href={`/shop/${lead.item.slug}`}
                        target="_blank"
                        className="font-semibold text-gold-500 hover:underline"
                      >
                        {itemTitle(lead.item)} ↗
                      </Link>
                    </p>
                  )}

                  {lead.message && (
                    <p className="mt-3 whitespace-pre-line rounded-lg bg-ink-50 px-3.5 py-3 text-sm leading-relaxed text-ink-700">
                      {lead.message}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                  {(["NEW", "CONTACTED", "CLOSED"] as const)
                    .filter((value) => value !== lead.status)
                    .map((value) => (
                      <form key={value} action={updateLeadStatus}>
                        <input type="hidden" name="id" value={lead.id} />
                        <input type="hidden" name="status" value={value} />
                        <button
                          type="submit"
                          className="rounded-lg border border-ink-300 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-100"
                        >
                          Mark {value.toLowerCase()}
                        </button>
                      </form>
                    ))}
                  <form action={deleteLead}>
                    <input type="hidden" name="id" value={lead.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-red-900 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-950/40"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
