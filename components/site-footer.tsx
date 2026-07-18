import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/jobs", label: "Browse jobs" },
      { href: "/companies", label: "Companies" },
      { href: "/ai/career-guidance", label: "AI career guidance" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/register", label: "Create account" },
      { href: "/login", label: "Sign in" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer style={{ background: "oklch(0.2 0.05 265)", color: "oklch(0.92 0.012 260)" }}>
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-16">
        <div className="grid gap-10 sm:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="font-display text-lg font-semibold text-white">J-Track</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm" style={{ color: "oklch(0.7 0.015 265)" }}>
              The calm, structured workspace for job seekers and recruiters.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-widest text-white">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm transition-colors hover:text-white"
                      style={{ color: "oklch(0.72 0.015 265)" }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="mt-12 border-t pt-6 text-xs"
          style={{ borderColor: "oklch(1 0 0 / 10%)", color: "oklch(0.62 0.015 265)" }}
        >
          &copy; {new Date().getFullYear()} J-Track &mdash; made for jobseekers and recruiters.
        </div>
      </div>
    </footer>
  );
}
