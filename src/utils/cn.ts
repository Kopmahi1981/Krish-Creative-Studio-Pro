/**
 * Lightweight className combiner.
 *
 * Filters out falsy values and joins the remainder with a single space.
 * Kept dependency-free to avoid pulling in `clsx`/`tailwind-merge` for Phase 1;
 * can be upgraded later if conditional-merge semantics become necessary.
 *
 * @param classes - Any mix of strings, falsy values, or arrays of strings.
 * @returns A single space-separated className string.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
