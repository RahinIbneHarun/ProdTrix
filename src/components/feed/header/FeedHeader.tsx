"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Search, SlidersHorizontal, User, X } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { initials, useCurrentUser } from "@/lib/feed/use-current-user";
import { activeFilterCount, filtersFromParams, filtersToQuery } from "@/lib/feed/utils";
import { cn } from "@/lib/utils";
import { FilterDrawer } from "./FilterDrawer";
import { FriendAddMenu } from "./FriendAddMenu";
import { HeaderIconButton } from "./HeaderIconButton";
import { NotificationsMenu } from "./NotificationsMenu";
import { SystemDrawer } from "./SystemDrawer";

export function FeedHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const filters = filtersFromParams(params);
  const filterCount = activeFilterCount(filters);
  const onFeed = pathname === "/feed";
  const { user } = useCurrentUser();

  const [query, setQuery] = useState(filters.q);
  const [filterOpen, setFilterOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the box in sync with back/forward navigation.
  useEffect(() => setQuery(filters.q), [filters.q]);

  // Live-search while on the feed; elsewhere the user submits with Enter.
  useEffect(() => {
    if (!onFeed || query === filters.q) return;
    const t = setTimeout(() => {
      router.replace(`/feed${filtersToQuery({ ...filters, q: query.trim() })}`, { scroll: false });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, onFeed]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/feed${filtersToQuery({ ...filters, q: query.trim() })}`);
    inputRef.current?.blur();
  };

  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/feed");
  };

  const onLogo = (e: React.MouseEvent) => {
    e.preventDefault();
    setQuery("");
    if (onFeed && !params.toString()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/feed");
      window.scrollTo({ top: 0 });
    }
  };

  const searchBox = (
    <form onSubmit={submit} role="search" className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search content, subjects, chapters, creators…"
        aria-label="Search"
        className="h-10 w-full rounded-full border border-border bg-muted/60 pl-9 pr-12 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:bg-background focus:ring-2 focus:ring-ring/30 [&::-webkit-search-cancel-button]:hidden"
      />
      <button
        type="button"
        onClick={() => setFilterOpen(true)}
        aria-label={filterCount ? `Filters, ${filterCount} active` : "Filters"}
        title="Filters"
        className={cn(
          "absolute right-1 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full transition-colors",
          filterCount ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        <SlidersHorizontal className="size-4" />
        {filterCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
            {filterCount}
          </span>
        )}
      </button>
    </form>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-1.5 px-3 sm:gap-2 sm:px-4">
        <HeaderIconButton label="Go back" onClick={goBack}>
          <ArrowLeft />
        </HeaderIconButton>

        <Link href="/feed" onClick={onLogo} className="flex shrink-0 items-center gap-2" aria-label="ProdTrix — back to top of feed">
          <BrandLogo className="h-8 w-8 rounded-lg" />
          <span className="hidden text-lg font-semibold tracking-tight md:inline">ProdTrix</span>
        </Link>

        <div className="mx-2 hidden min-w-0 flex-1 sm:block md:mx-6">
          <div className="mx-auto max-w-xl">{searchBox}</div>
        </div>
        <div className="flex-1 sm:hidden" />

        <HeaderIconButton
          label="Search"
          className="sm:hidden"
          onClick={() => setMobileSearch((v) => !v)}
          aria-expanded={mobileSearch}
        >
          {mobileSearch ? <X /> : <Search />}
        </HeaderIconButton>
        <FriendAddMenu />
        <NotificationsMenu />
        <Link
          href="/admin/profile"
          aria-label="Your profile"
          title="Your profile"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground ring-2 ring-transparent transition hover:ring-border"
        >
          {user ? initials(user.name) : <User className="size-4" />}
        </Link>
        <SystemDrawer />
      </div>

      {mobileSearch && <div className="border-t border-border px-3 py-2 sm:hidden">{searchBox}</div>}

      <FilterDrawer open={filterOpen} onOpenChange={setFilterOpen} />
    </header>
  );
}
