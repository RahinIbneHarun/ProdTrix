import { cn } from "@/lib/utils";

/** Monochrome icons: drawn as a CSS mask so they take the current text colour (works in both themes). */
const MONO = [
  "analytic",
  "back-button",
  "backpack",
  "camera",
  "chevron",
  "coment",
  "coment-2",
  "face",
  "insights-2",
  "magnifying-glass",
  "more",
  "newspaper",
  "notification",
  "packaging",
  "people",
  "presentation-board",
  "school-time",
  "school-time-2",
  "settings",
  "share",
  "share-2",
  "upload",
] as const;

/** Full-colour icons: shown as-is. */
const COLOR = ["approved", "check", "clap", "crown", "excellence", "luxury", "question-mark"] as const;

export type FeedIconName = (typeof MONO)[number] | (typeof COLOR)[number];

const isColor = (name: FeedIconName): name is (typeof COLOR)[number] =>
  (COLOR as readonly string[]).includes(name);

/**
 * Project icon set from `public/images/feed-icons`. Size it with Tailwind
 * (`size-4`, `size-5` …). Decorative by default; pass `label` when the icon
 * is the only content of a control.
 */
export function FeedIcon({
  name,
  className,
  label,
}: {
  name: FeedIconName;
  className?: string;
  label?: string;
}) {
  const src = `/images/feed-icons/${name}.png`;
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };

  if (isColor(name)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={label ?? ""} className={cn("inline-block size-4 shrink-0 object-contain", className)} />
    );
  }

  return (
    <span
      {...a11y}
      className={cn("inline-block size-4 shrink-0 bg-current", className)}
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}
