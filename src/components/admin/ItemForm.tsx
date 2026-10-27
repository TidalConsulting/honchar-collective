"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { ImageUploader, type UploadedImage } from "@/components/admin/ImageUploader";
import { CHECKBOX, FIELD, LABEL, TEXTAREA, fieldBorder } from "@/components/admin/fieldStyles";
import { formatPrice } from "@/lib/format";
import type { ItemFormState } from "@/app/actions/items";
import { BRANDS, CATEGORIES, GENDERS, HARDWARE, INCLUDES_OPTIONS } from "@/lib/site";

const INITIAL: ItemFormState = { status: "idle" };

export type ItemFormValues = {
  id?: string;
  brand?: string;
  name?: string;
  category?: string;
  gender?: string | null;
  condition?: string;
  price?: number;
  retailPrice?: number | null;
  sku?: string | null;
  serialNumber?: string | null;
  size?: string | null;
  color?: string | null;
  material?: string | null;
  hardware?: string | null;
  year?: number | null;
  authenticated?: boolean;
  authenticationNote?: string | null;
  description?: string | null;
  includes?: string[];
  arrival?: string;
  arrivesAt?: Date | null;
  costPrice?: number | null;
  importCost?: number | null;
  status?: string;
  soldPrice?: number | null;
  featured?: boolean;
  images?: UploadedImage[];
};

/** yyyy-mm-dd for a date input, in local time so the day doesn't shift. */
function dateInput(value?: Date | null) {
  if (!value) return "";
  const date = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const toNumber = (value: string) => {
  const parsed = Number(value);
  return value !== "" && Number.isFinite(parsed) ? parsed : null;
};

export function ItemForm({
  action,
  item = {},
  submitLabel,
}: {
  action: (state: ItemFormState, formData: FormData) => Promise<ItemFormState>;
  item?: ItemFormValues;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, INITIAL);
  const [includes, setIncludes] = useState<string[]>(item.includes ?? []);
  const [customInclude, setCustomInclude] = useState("");
  const [arrival, setArrival] = useState(item.arrival ?? "IN_DR");

  // Price and costs are held in state so the margin can be worked out live
  // as they're typed, rather than after saving.
  const [price, setPrice] = useState(item.price === undefined ? "" : String(item.price));
  const [cost, setCost] = useState(item.costPrice == null ? "" : String(item.costPrice));
  const [importCost, setImportCost] = useState(
    item.importCost == null ? "" : String(item.importCost),
  );

  const allIncludes = Array.from(new Set([...INCLUDES_OPTIONS, ...includes]));

  const toggleInclude = (entry: string) =>
    setIncludes((current) =>
      current.includes(entry) ? current.filter((value) => value !== entry) : [...current, entry],
    );
  const addCustom = () => {
    const value = customInclude.trim();
    if (value && !includes.includes(value)) setIncludes((current) => [...current, value]);
    setCustomInclude("");
  };

  const landed =
    toNumber(cost) === null ? null : (toNumber(cost) as number) + (toNumber(importCost) ?? 0);

  return (
    <form action={formAction} className="space-y-6">
      {state.status === "error" && state.message && (
        <p className="rounded-card border border-red-900 bg-red-950/40 px-4 py-3 text-sm font-semibold text-red-400">
          {state.message}
        </p>
      )}

      <Card title="The basics" subtitle="Everything a shopper sees first.">
        <datalist id="brand-options">
          {BRANDS.map((brand) => (
            <option key={brand} value={brand} />
          ))}
        </datalist>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            name="brand"
            label="Brand"
            required
            placeholder="Louis Vuitton"
            list="brand-options"
            defaultValue={item.brand}
            error={state.errors?.brand}
          />
          <Input
            name="name"
            label="Name"
            required
            placeholder="Neverfull MM Monogram"
            defaultValue={item.name}
            error={state.errors?.name}
          />
          <Select
            name="category"
            label="Category"
            required
            options={CATEGORIES.map((entry) => ({ value: entry, label: entry }))}
            defaultValue={item.category}
            error={state.errors?.category}
          />
          <Select
            name="condition"
            label="Condition"
            options={[
              { value: "NEW", label: "New — tags or stickers on" },
              { value: "EXCELLENT", label: "Excellent — barely used" },
              { value: "VERY_GOOD", label: "Very good — light wear" },
              { value: "GOOD", label: "Good — visible wear" },
              { value: "FAIR", label: "Fair — noticeable wear" },
            ]}
            defaultValue={item.condition ?? "EXCELLENT"}
          />
          <Select
            name="gender"
            label="For"
            allowEmpty
            options={GENDERS.map((entry) => ({ value: entry, label: entry }))}
            defaultValue={item.gender ?? ""}
          />
          <Input name="sku" label="SKU" placeholder="HC-1042" defaultValue={item.sku ?? ""} error={state.errors?.sku} />
          <Input
            name="price"
            label="Asking price"
            type="number"
            required
            prefix="$"
            value={price}
            onChange={setPrice}
            error={state.errors?.price}
          />
          <Input
            name="retailPrice"
            label="Retail price new"
            type="number"
            prefix="$"
            hint="Optional. Shown struck through, with the % saved."
            defaultValue={item.retailPrice ?? ""}
          />
        </div>
      </Card>

      <Card title="Photos" subtitle="The first photo is the one shoppers see in the grid. Portrait shots look best.">
        <ImageUploader name="images" initial={item.images ?? []} />
      </Card>

      <Card title="Details">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input name="size" label="Size" placeholder="MM, 38, M, 41mm…" defaultValue={item.size ?? ""} />
          <Input name="color" label="Color" placeholder="Monogram / Beige" defaultValue={item.color ?? ""} />
          <Input name="material" label="Material" placeholder="Coated canvas" defaultValue={item.material ?? ""} />
          <Select
            name="hardware"
            label="Hardware"
            allowEmpty
            options={HARDWARE.map((entry) => ({ value: entry, label: entry }))}
            defaultValue={item.hardware ?? ""}
          />
          <Input name="year" label="Year made" type="number" placeholder="2022" defaultValue={item.year ?? ""} />
        </div>
      </Card>

      <Card
        title="Authenticity"
        subtitle="A piece can't be bought on the site until it's marked authenticated."
      >
        <div className="space-y-4">
          <Checkbox
            name="authenticated"
            label="Inspected and authenticated"
            defaultChecked={item.authenticated ?? false}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              name="serialNumber"
              label="Date code / serial"
              placeholder="SD4189"
              hint="Staff-only. Never shown on the website."
              defaultValue={item.serialNumber ?? ""}
            />
            <Input
              name="authenticationNote"
              label="Note for shoppers"
              placeholder="Authenticated by Entrupy, certificate included."
              hint="Optional. Replaces the standard authenticity text on the listing."
              defaultValue={item.authenticationNote ?? ""}
            />
          </div>
        </div>
      </Card>

      <Card
        title="Import & landed cost"
        subtitle="Where the piece is, and what it cost to get here. Costs are staff-only and drive the margin on the dashboard."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Select
            name="arrival"
            label="Where it is"
            options={[
              { value: "IN_DR", label: "In the DR" },
              { value: "IN_TRANSIT", label: "In transit" },
            ]}
            value={arrival}
            onChange={setArrival}
          />
          {arrival === "IN_TRANSIT" ? (
            <Input
              name="arrivesAt"
              label="Expected arrival"
              type="date"
              defaultValue={dateInput(item.arrivesAt)}
              hint="Shown on the listing as “Arrives …”."
            />
          ) : (
            <input type="hidden" name="arrivesAt" value="" />
          )}
          <Input
            name="costPrice"
            label="Purchase price (US)"
            type="number"
            prefix="$"
            value={cost}
            onChange={setCost}
          />
          <Input
            name="importCost"
            label="Shipping + customs"
            type="number"
            prefix="$"
            value={importCost}
            onChange={setImportCost}
          />
        </div>
        <MarginLine landed={landed} price={toNumber(price)} label="at the asking price" />
      </Card>

      <Card title="Comes with" subtitle="Tick everything included. These show as chips on the listing.">
        {includes.map((entry) => (
          <input key={entry} type="hidden" name="includes" value={entry} />
        ))}

        <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
          {allIncludes.map((entry) => (
            <label
              key={entry}
              className="flex cursor-pointer items-center gap-2.5 rounded-md px-1.5 py-1.5 text-sm hover:bg-ink-100"
            >
              <input
                type="checkbox"
                checked={includes.includes(entry)}
                onChange={() => toggleInclude(entry)}
                className={CHECKBOX}
              />
              <span className="text-ink-700">{entry}</span>
            </label>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <input
            value={customInclude}
            onChange={(event) => setCustomInclude(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addCustom();
              }
            }}
            placeholder="Add something else — e.g. “Rain cover”"
            className={`min-w-0 flex-1 sm:min-w-64 ${FIELD} border-ink-300`}
          />
          <button
            type="button"
            onClick={addCustom}
            className="h-12 rounded-lg border border-ink-300 px-5 text-base font-semibold text-ink-700 hover:bg-ink-100"
          >
            Add
          </button>
        </div>
      </Card>

      <Card
        title="Description"
        subtitle="Say exactly what a shopper would see in person: wear, smells, repairs, and how it carries."
      >
        <textarea
          name="description"
          rows={7}
          defaultValue={item.description ?? ""}
          placeholder="Light patina on the handles, corners clean, interior free of stains. Date code legible. Comes with the original pouch."
          className={`${TEXTAREA} border-ink-300`}
        />
      </Card>

      <Card title="Visibility">
        <SaleDetails
          initialStatus={item.status ?? "PUBLISHED"}
          listPrice={toNumber(price) ?? undefined}
          soldPrice={item.soldPrice ?? null}
          featured={item.featured}
          landed={landed}
        />
      </Card>

      <div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-3 border-t border-ink-200 bg-ink-50/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        <Link
          href="/admin"
          className="rounded-full border border-ink-300 px-5 py-3 text-sm font-semibold text-ink-700 hover:bg-ink-100"
        >
          Cancel
        </Link>
        <Submit label={submitLabel} />
      </div>
    </form>
  );
}

/** Profit and margin against the landed cost, worked out as the numbers are typed. */
function MarginLine({
  landed,
  price,
  label,
}: {
  landed: number | null;
  price: number | null;
  label: string;
}) {
  if (landed === null) {
    return (
      <p className="mt-4 text-sm text-ink-500">
        Enter the purchase price to see the landed cost and margin.
      </p>
    );
  }
  const profit = price ? price - landed : null;
  const margin = price && profit !== null ? Math.round((profit / price) * 1000) / 10 : null;

  return (
    <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 rounded-lg border border-ink-200 bg-ink-50 px-4 py-3 text-sm">
      <div>
        <dt className="text-xs font-semibold uppercase tracking-wider text-ink-500">Landed cost</dt>
        <dd className="mt-0.5 font-bold text-ink-900 tabular-nums">{formatPrice(landed)}</dd>
      </div>
      {profit !== null && (
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wider text-ink-500">Profit {label}</dt>
          <dd className={`mt-0.5 font-bold tabular-nums ${profit < 0 ? "text-red-400" : "text-emerald-400"}`}>
            {profit < 0 ? "−" : ""}
            {formatPrice(Math.abs(profit))}
            <span className="ml-2 font-semibold text-ink-600">{margin}% margin</span>
          </dd>
        </div>
      )}
    </dl>
  );
}

/**
 * Listing status, and the final sale price that only matters once it's Sold.
 *
 * The price box appears when Sold is picked rather than sitting there always:
 * on every other listing it's a field with no meaningful answer, and it reads
 * as something you're supposed to fill in. The margin line underneath is the
 * point of capturing it — it turns the numbers into the answer the owner
 * actually wants, without doing arithmetic on a phone mid-delivery.
 */
function SaleDetails({
  initialStatus,
  listPrice,
  soldPrice,
  featured,
  landed,
}: {
  initialStatus: string;
  listPrice?: number;
  soldPrice: number | null;
  featured?: boolean;
  landed: number | null;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [finalPrice, setFinalPrice] = useState(soldPrice === null ? "" : String(soldPrice));

  const final = Number(finalPrice);
  const showMargin = Boolean(listPrice) && Number.isFinite(final) && final > 0;
  const difference = showMargin ? final - (listPrice as number) : 0;
  const percentOfList = showMargin ? Math.round((final / (listPrice as number)) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          name="status"
          label="Listing status"
          options={[
            { value: "PUBLISHED", label: "Live — visible on the website" },
            { value: "DRAFT", label: "Draft — hidden from shoppers" },
            { value: "SOLD", label: "Sold — shown with a sold badge" },
          ]}
          value={status}
          onChange={setStatus}
        />
        <div className="flex items-end pb-2">
          <Checkbox
            name="featured"
            label="★ Feature in The Edit on the homepage and at the top of the shop"
            defaultChecked={featured}
          />
        </div>
      </div>

      {status === "SOLD" && (
        <div className="rounded-lg border border-ink-200 bg-ink-50 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              name="soldPrice"
              label="Final sale price"
              type="number"
              prefix="$"
              value={finalPrice}
              onChange={setFinalPrice}
              placeholder={listPrice ? String(listPrice) : undefined}
              hint="What it actually went for. Staff-only — never shown on the website."
            />
            <div className="flex items-end pb-2">
              {showMargin ? (
                <dl className="text-sm">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                    Against the {formatPrice(listPrice as number)} asking price
                  </dt>
                  <dd className="mt-1 font-bold text-ink-900">
                    <span
                      className={
                        difference < 0
                          ? "text-red-400"
                          : difference > 0
                            ? "text-emerald-400"
                            : "text-ink-900"
                      }
                    >
                      {difference === 0
                        ? "Sold at asking"
                        : `${difference < 0 ? "−" : "+"}${formatPrice(Math.abs(difference))}`}
                    </span>
                    <span className="ml-2 font-semibold text-ink-600">
                      {percentOfList}% of list
                    </span>
                  </dd>
                </dl>
              ) : (
                <p className="pb-1 text-sm text-ink-500">
                  Leave it blank if you&apos;d rather not record the number — the piece still
                  shows as sold.
                </p>
              )}
            </div>
          </div>
          {showMargin && <MarginLine landed={landed} price={final} label="on this sale" />}
        </div>
      )}
    </div>
  );
}

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-gold-500 px-7 py-3 text-sm font-bold text-black transition-colors hover:bg-gold-400 disabled:opacity-60"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-card border border-ink-200 bg-surface p-5 sm:p-6">
      <h2 className="text-lg font-bold text-ink-900">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-ink-600">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Input({
  name,
  label,
  type = "text",
  required,
  placeholder,
  defaultValue,
  hint,
  error,
  prefix,
  suffix,
  step,
  list,
  value,
  onChange,
}: {
  name: string;
  label: string;
  type?: string;
  /** id of a <datalist> to suggest values from. */
  list?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string | number | null;
  hint?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
  step?: string;
  /** Pass both to drive the input from state instead of leaving it uncontrolled. */
  value?: string;
  onChange?: (value: string) => void;
}) {
  const controlled =
    value !== undefined && onChange
      ? { value, onChange: (event: { target: { value: string } }) => onChange(event.target.value) }
      : { defaultValue: defaultValue ?? "" };

  return (
    <label className="block">
      <span className={LABEL}>
        {label}
        {required && <span className="ml-0.5 text-gold-500">*</span>}
      </span>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-ink-400">
            {prefix}
          </span>
        )}
        <input
          type={type}
          name={name}
          step={step}
          list={list}
          required={required}
          placeholder={placeholder}
          {...controlled}
          className={`${FIELD} ${fieldBorder(!!error)} ${prefix ? "pl-8" : ""} ${
            suffix ? "pr-14" : ""
          }`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-base text-ink-400">
            {suffix}
          </span>
        )}
      </div>
      {error ? (
        <span className="mt-1 block text-xs font-medium text-red-400">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-ink-500">{hint}</span>
      ) : null}
    </label>
  );
}

function Select({
  name,
  label,
  options,
  defaultValue,
  required,
  allowEmpty,
  error,
  value,
  onChange,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  required?: boolean;
  allowEmpty?: boolean;
  error?: string;
  /** Pass both to drive the select from state instead of leaving it uncontrolled. */
  value?: string;
  onChange?: (value: string) => void;
}) {
  const current = value ?? defaultValue;
  const controlled =
    value !== undefined && onChange
      ? { value, onChange: (event: { target: { value: string } }) => onChange(event.target.value) }
      : { defaultValue: defaultValue ?? (allowEmpty ? "" : options[0]?.value) };

  return (
    <label className="block">
      <span className={LABEL}>
        {label}
        {required && <span className="ml-0.5 text-gold-500">*</span>}
      </span>
      <select
        name={name}
        required={required}
        {...controlled}
        className={`${FIELD} ${fieldBorder(!!error)}`}
      >
        {(allowEmpty || !current) && <option value="">— Select —</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="mt-1 block text-xs font-medium text-red-400">{error}</span>}
    </label>
  );
}

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-base font-medium text-ink-800">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className={CHECKBOX}
      />
      {label}
    </label>
  );
}
