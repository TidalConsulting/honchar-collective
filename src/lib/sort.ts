/** Shared by the server-side query builder and the client-side sort control. */
export const SORT_OPTIONS = [
  { value: "best", label: "Featured" },
  { value: "newest", label: "Just in" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "condition", label: "Condition: best first" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];
